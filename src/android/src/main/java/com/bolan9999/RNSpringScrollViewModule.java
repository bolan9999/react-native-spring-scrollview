
package com.bolan9999;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UIManager;

public class RNSpringScrollViewModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public RNSpringScrollViewModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "SpringScrollViewModule";
    }

}