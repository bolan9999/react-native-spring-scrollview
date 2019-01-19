package com.bolan9999;

import android.util.Log;
import android.view.View;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import javax.annotation.Nullable;

public class SpringScrollViewManager extends ViewGroupManager {
    @Override
    public String getName() {
        return "SpringScrollView";
    }

    @Override
    protected View createViewInstance(ThemedReactContext reactContext) {
        return new SpringScrollView(reactContext);
    }

    @ReactProp(name = "refreshHeaderHeight")
    public void setRefreshHeaderHeight(SpringScrollView view, float height) {
        view.setRefreshHeaderHeight(height);
    }

    @ReactProp(name = "loadingFooterHeight")
    public void setLoadingFooterHeight(SpringScrollView view, float height) {
        view.setLoadingFooterHeight(height);
    }

    @ReactProp(name = "bounces")
    public void setBounces(SpringScrollView view, boolean bounces) {
        view.setBounces(bounces);
    }

    @Nullable
    @Override
    public Map getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder.builder()
                .put("onScroll", MapBuilder.of(
                        "phasedRegistrationNames",
                        MapBuilder.of("bubbled", "onScroll")))
                .put("onRefresh", MapBuilder.of(
                        "phasedRegistrationNames",
                        MapBuilder.of("bubbled", "onRefresh")))
                .put("onLoading", MapBuilder.of(
                        "phasedRegistrationNames",
                        MapBuilder.of("bubbled", "onLoading")))
                .put("onLayoutChange", MapBuilder.of(
                        "phasedRegistrationNames",
                        MapBuilder.of("bubbled", "onLayoutChange")))
                .put("onTouchBegin", MapBuilder.of(
                        "phasedRegistrationNames",
                        MapBuilder.of("bubbled", "onTouchBegin")))
                .put("onTouchEnd", MapBuilder.of(
                        "phasedRegistrationNames",
                        MapBuilder.of("bubbled", "onTouchEnd")))
                .put("onMomentumScrollBegin", MapBuilder.of(
                        "phasedRegistrationNames",
                        MapBuilder.of("bubbled", "onMomentumScrollBegin")))
                .put("onMomentumScrollEnd", MapBuilder.of(
                        "phasedRegistrationNames",
                        MapBuilder.of("bubbled", "onMomentumScrollEnd")))
                .build();
    }

    @Override
    public void receiveCommand(View root, int commandId, @Nullable ReadableArray args) {
        SpringScrollView scrollView = (SpringScrollView) root;
        switch (commandId) {
            case 10000:
                scrollView.endRefresh();
                break;
            case 10001:
                scrollView.endLoading();
                break;
            case 10002:
                scrollView.scrollTo(
                        (float) args.getDouble(0),
                        (float) args.getDouble(1),
                        args.getBoolean(2));
                break;
        }
    }
}
