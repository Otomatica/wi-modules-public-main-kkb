package com.infiniteautomation.mango.temip.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.checkerframework.checker.nullness.qual.NonNull;
import org.jooq.Record;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.infiniteautomation.mango.spring.DaoDependencies;
import com.infiniteautomation.mango.spring.MangoRuntimeContextConfiguration;
import com.infiniteautomation.mango.spring.service.PermissionService;
import com.infiniteautomation.mango.temip.model.Temip;
import com.infiniteautomation.mango.temip.model.TemipRecord;
import com.infiniteautomation.mango.temip.service.SnmpService;
import com.infiniteautomation.mango.temip.vo.TemipVO;
import com.infiniteautomation.mango.util.LazyInitSupplier;
import com.serotonin.m2m2.Common;
import com.serotonin.m2m2.db.dao.AbstractBasicDao;
import com.serotonin.m2m2.i18n.TranslatableMessage;
import com.serotonin.m2m2.rt.event.type.SystemEventType;

@Repository
public class TemipDao extends AbstractBasicDao<TemipVO, TemipRecord, Temip> {
    
	
    private static final LazyInitSupplier<TemipDao> springInstance = new LazyInitSupplier<>(() -> {
        return Common.getRuntimeContext().getBean(TemipDao.class);
    });
    
    @Autowired
    private TemipDao(DaoDependencies daoDependencies) {
        super(daoDependencies, Temip.TEMIP);
    }
    
    @Override
    public void insert(TemipVO vo) {
        vo.setTrapStatus("Sending");
        vo.setTimestamp(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss Z").format(new Date()));
        super.insert(vo);
        
        try {
            SnmpService.sendV2Inform(vo);
            vo.setTrapStatus("Succeed");
            update(vo.getId(), vo);
        } catch (Exception e) {
            vo.setTrapStatus("Failed");
            update(vo.getId(), vo);
            SystemEventType eventType = new SystemEventType("TEMIP_INFORM_FAILURE");
            TranslatableMessage message = new TranslatableMessage("temip.event.inform", vo.getAddress(), vo.getPort());
            SystemEventType.raiseEvent(eventType, Common.timer.currentTimeMillis(), false, message);
        }
    }

    public static TemipDao getInstance() {
        return springInstance.get();
    }

    @Override
    protected Record toRecord(TemipVO vo) {
    	
    	Record record = table.newRecord();
        record.set(table.eventDetectorId, vo.getEventDetectorId());
        record.set(table.priority, vo.getPriority());
        record.set(table.alarmState, vo.getAlarmState());
        record.set(table.source, vo.getSource());
        record.set(table.category, vo.getCategory());
        record.set(table.alarmText, vo.getAlarmText());
        record.set(table.timestamp, vo.getTimestamp());
        record.set(table.address, vo.getAddress());
        record.set(table.port, vo.getPort());
        record.set(table.trapStatus, vo.getTrapStatus());
        return record;
        
    	/*
        return new TemipRecord(
        	vo.getId(),
            vo.getEventDetectorId(),
            vo.getPriority(),
            vo.getAlarmState(),
            vo.getSource(),
            vo.getCategory(),
            vo.getAlarmText(),
            vo.getTimestamp(),
            vo.getAddress(),
            vo.getPort(),
            vo.getTrapStatus()
        );
        */
    }

    class TemipRowMapper implements RowMapper<TemipVO> {
        @Override
        public TemipVO mapRow(ResultSet rs, int rowNum) throws SQLException {
        	int i = 0;
            TemipVO vo = new TemipVO();
            vo.setId(rs.getInt(++i));
            vo.setEventDetectorId(rs.getInt(++i));
            vo.setPriority(rs.getInt(++i));
            vo.setAlarmState(rs.getInt(++i));
            vo.setSource(rs.getString(++i));
            vo.setCategory(rs.getString(++i));
            vo.setAlarmText(rs.getString(++i));
            vo.setTimestamp(rs.getString(++i));
            vo.setAddress(rs.getString(++i));
            vo.setPort(rs.getInt(++i));
            vo.setTrapStatus(rs.getString(++i));
            return vo;
        }
    }
    
    public static final String activeEventSQL = "select * from (SELECT *, ROW_NUMBER() OVER (PARTITION BY eventDetectorId ORDER BY id desc) AS rn FROM temip) as grouped where grouped.rn = 1 and grouped.alarmState = 1";
    public List<TemipVO> getActiveEvents() {
        return ejt.query(activeEventSQL, new TemipRowMapper());
    }

	@Override
	public @NonNull TemipVO mapRecord(@NonNull Record record) {
        TemipVO vo = new TemipVO();
        vo.setId(record.get(table.id));
        vo.setEventDetectorId(record.get(table.eventDetectorId));
        vo.setPriority(record.get(table.priority));
        vo.setAlarmState(record.get(table.alarmState));
        vo.setSource(record.get(table.source));
        vo.setCategory(record.get(table.category));
        vo.setAlarmText(record.get(table.alarmText));
        vo.setTimestamp(record.get(table.timestamp));
        vo.setAddress(record.get(table.address));
        vo.setPort(record.get(table.port));
        vo.setTrapStatus(record.get(table.trapStatus));
        return vo;
	}
}
