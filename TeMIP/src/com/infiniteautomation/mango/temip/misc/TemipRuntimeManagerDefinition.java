package com.infiniteautomation.mango.temip.misc;

import com.infiniteautomation.mango.temip.service.SnmpService;
import com.serotonin.m2m2.module.RuntimeManagerDefinition;
import com.serotonin.m2m2.module.license.ITimedLicenseDefinition;
import com.serotonin.m2m2.module.license.ITimedLicenseRegistrar;
import com.serotonin.provider.Providers;

public class TemipRuntimeManagerDefinition extends RuntimeManagerDefinition
{
    private SnmpService snmpService;
    public int getInitializationPriority() {
        return 12;
    }
    
    public void preInitialize() {
        ((ITimedLicenseRegistrar)Providers.get((Class)ITimedLicenseRegistrar.class)).registerTimedLicense((ITimedLicenseDefinition)new TemipTimedLicenseDefinition());
    }

    @Override
    public void initialize(boolean safe) {
        snmpService = new SnmpService();
        snmpService.start();
    }

    @Override
    public void terminate() {
        snmpService.stop();
    }
}
