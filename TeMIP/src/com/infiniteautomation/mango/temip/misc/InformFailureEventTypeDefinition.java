package com.infiniteautomation.mango.temip.misc;

import com.serotonin.m2m2.i18n.Translations;
import com.serotonin.m2m2.module.SystemEventTypeDefinition;
import com.serotonin.m2m2.rt.event.AlarmLevels;

public class InformFailureEventTypeDefinition extends SystemEventTypeDefinition {
    
    @Override
    public String getTypeName() {
       return "TEMIP_INFORM_FAILURE";
    }

    @Override
    public String getDescriptionKey() {
        return "event.system.inform";
    }

    @Override
    public String getEventListLink(int ref1, int ref2, Translations translations) {
        return null;
    }

    @Override
    public boolean supportsReferenceId1() {
        return false;
    }

    @Override
    public boolean supportsReferenceId2() {
        return false;
    }
    
    @Override
    public AlarmLevels getDefaultAlarmLevel() {
        return AlarmLevels.WARNING;
    }
}
