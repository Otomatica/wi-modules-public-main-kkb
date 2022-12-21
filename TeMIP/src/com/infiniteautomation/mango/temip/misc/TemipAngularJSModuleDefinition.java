package com.infiniteautomation.mango.temip.misc;

import com.serotonin.m2m2.module.AngularJSModuleDefinition;

public class TemipAngularJSModuleDefinition extends AngularJSModuleDefinition {
    @Override
    public String getJavaScriptFilename() {
        return "/angular/TeMIP.js";
    }
}
