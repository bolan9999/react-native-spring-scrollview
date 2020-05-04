package com.bolan9999;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

class ScrollEvent extends Event {
    private String evtName;
    private WritableMap param;

    public static ScrollEvent obtain(int viewTag, String evtName, WritableMap param){
        ScrollEvent evt = new ScrollEvent();
        evt.init(viewTag);
        evt.evtName=evtName;
        evt.param=param;
        return evt;
    }

    @Override
    public String getEventName() {
        return evtName;
    }

    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        rctEventEmitter.receiveEvent(getViewTag(),getEventName(),param);
    }
}
