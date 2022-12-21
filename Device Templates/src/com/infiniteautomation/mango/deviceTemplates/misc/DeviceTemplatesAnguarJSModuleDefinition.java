package com.infiniteautomation.mango.deviceTemplates.misc;

import com.serotonin.m2m2.module.AngularJSModuleDefinition;

public class DeviceTemplatesAnguarJSModuleDefinition extends AngularJSModuleDefinition {
    @Override
    public String getJavaScriptFilename() {
        return "/angular/deviceTemplates.js";
    }
}