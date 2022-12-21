package com.infiniteautomation.mango.temip.vo;

import com.serotonin.m2m2.vo.AbstractBasicVO;

public class TemipVO extends AbstractBasicVO {

    public static final String XID_PREFIX = "TE_";
    
    private Integer eventDetectorId;
    private Integer priority;
    private Integer alarmState;
    
    private String source;
    private String category;
    private String alarmText;
    private String timestamp;
    
    private String address;
    private Integer port;
    private String trapStatus;

    public Integer getEventDetectorId() {
        return eventDetectorId;
    }

    public void setEventDetectorId(Integer eventDetectorId) {
        this.eventDetectorId = eventDetectorId;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public Integer getAlarmState() {
        return alarmState;
    }

    public void setAlarmState(Integer alarmState) {
        this.alarmState = alarmState;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getAlarmText() {
        return alarmText;
    }

    public void setAlarmText(String alarmText) {
        this.alarmText = alarmText;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Integer getPort() {
        return port;
    }

    public void setPort(Integer port) {
        this.port = port;
    }

    public String getTrapStatus() {
        return trapStatus;
    }

    public void setTrapStatus(String trapStatus) {
        this.trapStatus = trapStatus;
    }
    
}
