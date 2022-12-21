package com.infiniteautomation.mango.deviceTemplates.misc;

import com.serotonin.m2m2.module.RuntimeManagerDefinition;
import com.serotonin.m2m2.module.license.ITimedLicenseDefinition;
import com.serotonin.m2m2.module.license.ITimedLicenseRegistrar;
import com.serotonin.provider.Providers;

public class DeviceTemplatesRuntimeManagerDefinition extends RuntimeManagerDefinition
{

    public int getInitializationPriority() {
        return 12;
    }
    
    public void preInitialize() {
        ((ITimedLicenseRegistrar)Providers.get((Class)ITimedLicenseRegistrar.class)).registerTimedLicense((ITimedLicenseDefinition)new DeviceTemplatesTimedLicenseDefinition());
    }

    @Override
    public void initialize(boolean safe) {

    }

    @Override
    public void terminate() {

    }
}