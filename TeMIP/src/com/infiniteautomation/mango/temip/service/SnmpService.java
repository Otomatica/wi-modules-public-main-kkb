package com.infiniteautomation.mango.temip.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.snmp4j.CommandResponder;
import org.snmp4j.CommandResponderEvent;
import org.snmp4j.CommunityTarget;
import org.snmp4j.MessageDispatcher;
import org.snmp4j.MessageDispatcherImpl;
import org.snmp4j.MessageException;
import org.snmp4j.PDU;
import org.snmp4j.Snmp;
import org.snmp4j.TransportMapping;
import org.snmp4j.event.ResponseEvent;
import org.snmp4j.mp.MPv1;
import org.snmp4j.mp.MPv2c;
import org.snmp4j.mp.SnmpConstants;
import org.snmp4j.mp.StatusInformation;
import org.snmp4j.smi.Address;
import org.snmp4j.smi.GenericAddress;
import org.snmp4j.smi.Integer32;
import org.snmp4j.smi.Null;
import org.snmp4j.smi.OID;
import org.snmp4j.smi.OctetString;
import org.snmp4j.smi.TcpAddress;
import org.snmp4j.smi.TimeTicks;
import org.snmp4j.smi.UdpAddress;
import org.snmp4j.smi.Variable;
import org.snmp4j.smi.VariableBinding;
import org.snmp4j.transport.DefaultTcpTransportMapping;
import org.snmp4j.transport.DefaultUdpTransportMapping;
import org.snmp4j.util.MultiThreadedMessageDispatcher;
import org.snmp4j.util.ThreadPool;

import com.infiniteautomation.mango.temip.dao.TemipDao;
import com.infiniteautomation.mango.temip.vo.TemipVO;
import com.serotonin.m2m2.Common;
import com.serotonin.m2m2.i18n.TranslatableMessage;
import com.serotonin.m2m2.rt.event.type.SystemEventType;

public class SnmpService implements CommandResponder {
	
	private final Logger log = LoggerFactory.getLogger(SnmpService.class);
	
    public static final long startTime        = System.nanoTime();
    public static final OID notificationOid   = new OID("1.3.6.1.4.1.50112.1.1.1.2.1"); //1.3.6.1.4.1.56192.2
    public static final OID entryOid          = new OID("1.3.6.1.4.1.50112.1.1.1.1.1.1"); //1.3.6.1.4.1.56192.1.1
    public static final int propertyCount     = 7;
    
    public static final String genericAdress = System.getProperty("snmp4j.listenAddress", "udp:0.0.0.0/161");
    public static final int threadPoolSize = 10;
    private Snmp snmp;
    
    public SnmpService() {
        
    }
    
    public void start() {
        try {
            listen();
        } catch (IOException e) {
            SystemEventType eventType = new SystemEventType("TEMIP_ACTIVESYNC_FAILURE");
            TranslatableMessage message = new TranslatableMessage("temip.event.activeSync", e.getMessage());
            SystemEventType.raiseEvent(eventType, Common.timer.currentTimeMillis(), false, message);
        }
    }
    
    public void stop() {
        try {
            snmp.close();
        } catch (IOException e) {
            log.error("[ERROR] SnmpService - Error while closing SNMP -- " + e.getMessage());
        }
    }
    
    private void listen() throws IOException {
        Address address = GenericAddress.parse(genericAdress);
        TransportMapping<?> transport;
        if (address instanceof UdpAddress)
            transport = new DefaultUdpTransportMapping((UdpAddress) address);
        else
            transport = new DefaultTcpTransportMapping((TcpAddress) address);
        
        ThreadPool threadPool = ThreadPool.create("TemipDispatcher", threadPoolSize);
        MessageDispatcher mtDispatcher = new MultiThreadedMessageDispatcher(threadPool, new MessageDispatcherImpl());
        
        // add message processing models
        mtDispatcher.addMessageProcessingModel(new MPv1());
        mtDispatcher.addMessageProcessingModel(new MPv2c());
        
        snmp = new Snmp(mtDispatcher, transport);
        snmp.addCommandResponder(this);
        snmp.listen();
    }
    
    public synchronized void processPdu(CommandResponderEvent event) {
        PDU pdu = event.getPDU();
        int pduType = pdu.getType();
        
        if (pduType == PDU.GET) handleGet(pdu, pduType);
        else if (pduType == PDU.GETNEXT) handleGet(pdu, pduType);
        else if (pduType == PDU.GETBULK) handleGetBulk(pdu);
        else if (pduType == PDU.SET) pdu.setErrorStatus(PDU.readOnly);
        else pdu.setErrorStatus(PDU.resourceUnavailable);
        //pduType == PDU.TRAP || pduType == PDU.V1TRAP || pduType == PDU.REPORT || pduType == PDU.RESPONSE || pduType == PDU.NOTIFICATION
        
        try {
            pdu.setType(PDU.RESPONSE);
            
            event.getMessageDispatcher().returnResponsePdu(
                event.getMessageProcessingModel(),
                event.getSecurityModel(), 
                event.getSecurityName(), 
                event.getSecurityLevel(),
                pdu, 
                event.getMaxSizeResponsePDU(), 
                event.getStateReference(), 
                new StatusInformation()
            );
        } catch (MessageException e) {
            log.error("[ERROR] SNMP TeMIP Active Sync -- " + e.getMessage());
        }
    }

    private void handleGet(PDU pdu, int pduType) {
        List<TemipVO> activeEvents = TemipDao.getInstance().getActiveEvents();
        List<? extends VariableBinding> vbList = pdu.getVariableBindings();
        
        for(int i = 0; i< vbList.size(); i++) {
            VariableBinding vb = vbList.get(i);
            if(!getData(vb, pduType, activeEvents)) {
                pdu.setErrorIndex(i + 1);
                pdu.setErrorStatus(PDU.noSuchName);
                break;
            }
        }
    }
    
    private void handleGetBulk(PDU pdu) {
        List<TemipVO> activeEvents = TemipDao.getInstance().getActiveEvents();
        List<VariableBinding> returnVb = new ArrayList<VariableBinding>();
        OID lastOid = pdu.getVariableBindings().get(0).getOid();
        int max = pdu.getMaxRepetitions();
        
        while(returnVb.size() < max) {
            VariableBinding newVb = new VariableBinding(lastOid);
            if(!getData(newVb, PDU.GETNEXT, activeEvents)) break;
            returnVb.add(newVb);
            lastOid = new OID(newVb.getOid());
        }
        
        if(returnVb.size() < max) returnVb.add(new VariableBinding(lastOid, Null.endOfMibView));
        pdu.setVariableBindings(returnVb);
    }
    
    private boolean getData(VariableBinding vb, int pduType, List<TemipVO> activeEvents) {
        OID oid = vb.getOid();
        for(int propertyIndex = 1; propertyIndex <= propertyCount; propertyIndex++) {
            int alarmIndex = 0;
            for(TemipVO activeEvent : activeEvents) {
                OID loopOid = new OID(entryOid).append(propertyIndex).append(++alarmIndex);
                
                if(pduType == PDU.GET && oid.compareTo(loopOid) == 0) {
                    Variable data = getVariable(activeEvent, propertyIndex);
                    vb.setVariable(data);
                    return true;	
                }
                
                if(pduType == PDU.GETNEXT && oid.compareTo(loopOid) < 0) {
                    Variable data = getVariable(activeEvent, propertyIndex);
                    vb.setVariable(data);
                    vb.setOid(loopOid);
                    return true;
                }
            }
        }
        return false;
    }

    public static void sendV2Inform(TemipVO vo) throws IOException {
        PDU pdu = new PDU();
        pdu.setType(PDU.INFORM);
        
        // V2 Infrom specific info
        long sysUpTime = (System.nanoTime() - startTime) / 10000000;  // 10^-7
        pdu.add(new VariableBinding(SnmpConstants.sysUpTime, new TimeTicks(sysUpTime)));
        pdu.add(new VariableBinding(SnmpConstants.snmpTrapOID, notificationOid));
        //pdu.add(new VariableBinding(SnmpConstants.sysDescr, new OctetString("Wiseif Snmp Module")));
        
        // payload
        for(int i = 1; i <= propertyCount; i++)
            pdu.add( new VariableBinding(new OID(entryOid).append(i), getVariable(vo, i) ));
        
        DefaultUdpTransportMapping transport = null;
        Snmp snmp = null;
        try{
        	transport = new DefaultUdpTransportMapping();
            transport.listen();
            
            snmp = new Snmp(transport);
            CommunityTarget cTarget = new CommunityTarget();
            cTarget.setCommunity(new OctetString("public"));
            cTarget.setVersion(SnmpConstants.version2c);
            cTarget.setAddress(new UdpAddress(vo.getAddress() + "/" + vo.getPort()));
            cTarget.setRetries(5);
            cTarget.setTimeout(5000);
            
            ResponseEvent response = snmp.send(pdu, cTarget);
            if(response.getResponse() == null) throw new IOException("Response is null");
            
        }finally {
            snmp.close();
            transport.close();
        }
    }
    
    public static Variable getVariable(TemipVO vo, int propertyIndex) {
        if(propertyIndex == 1) return new OctetString(vo.getSource());
        if(propertyIndex == 2) return new OctetString(vo.getAlarmState() == 0 ? "Normal" : "Alarm");
        if(propertyIndex == 3) return new OctetString(vo.getAlarmText());
        if(propertyIndex == 4) return new Integer32(vo.getPriority());
        if(propertyIndex == 5) return new OctetString(vo.getCategory());
        if(propertyIndex == 6) return new Integer32(vo.getEventDetectorId());
        if(propertyIndex == 7) return new OctetString(vo.getTimestamp());
        return null;
    }
    
}
