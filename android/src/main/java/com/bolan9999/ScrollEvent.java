package com.bolan9999;

import androidx.core.util.Pools;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class ScrollEvent extends Event<ScrollEvent> {

    public static final String EVENT_NAME = "onScroll";

    private static final int TOUCH_EVENTS_POOL_SIZE = 7; // magic

    private static final Pools.SynchronizedPool<ScrollEvent> EVENTS_POOL =
            new Pools.SynchronizedPool<>(TOUCH_EVENTS_POOL_SIZE);

    private WritableMap mParam;

    public static ScrollEvent obtain(int viewTag, WritableMap param) {
        ScrollEvent event = EVENTS_POOL.acquire();
        if (event == null) {
            event = new ScrollEvent();
        }
        event.init(viewTag, param);
        return event;
    }

    @Override
    public void onDispose() {
        mParam = null;
        EVENTS_POOL.release(this);
    }

    protected void init(int viewTag, WritableMap param) {
        super.init(viewTag);
        this.mParam = param;
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
    }


    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        rctEventEmitter.receiveEvent(getViewTag(), EVENT_NAME, mParam);
    }
}