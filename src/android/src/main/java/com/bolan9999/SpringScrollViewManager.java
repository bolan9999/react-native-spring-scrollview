package com.bolan9999;

import android.view.View;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import javax.annotation.Nullable;

class SpringScrollViewManager extends ViewGroupManager {
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
        height = PixelUtil.toPixelFromDIP(height);
        view.setRefreshHeaderHeight(height);
    }

    @ReactProp(name = "loadingFooterHeight")
    public void setLoadingFooterHeight(SpringScrollView view, float height) {
        height = PixelUtil.toPixelFromDIP(height);
        view.setLoadingFooterHeight(height);
    }

    @ReactProp(name = "bounces")
    public void setBounces(SpringScrollView view, boolean bounces) {
        view.setBounces(bounces);
    }

    @ReactProp(name = "scrollEnabled")
    public void setScrollEnabled(SpringScrollView view, boolean scrollEnabled) {
        view.setScrollEnabled(scrollEnabled);
    }

    @ReactProp(name = "decelerationRate")
    public void setDecelerationRate(SpringScrollView view, float decelerationRate) {
        view.setDecelerationRate(decelerationRate);
    }

    @ReactProp(name = "initialContentOffset")
    public void setInitContentOffset(SpringScrollView view, ReadableMap offset) {
        float x = offset != null ? PixelUtil.toPixelFromDIP(offset.getDouble("x")) : 0;
        float y = offset != null ? PixelUtil.toPixelFromDIP(offset.getDouble("y")) : 0;
        view.setInitContentOffset(x, y);
    }

    @ReactProp(name = "allLoaded")
    public void setAllLoaded(SpringScrollView view, boolean allLoaded) {
        view.setAllLoaded(allLoaded);
    }

    @ReactProp(name = "inverted")
    public void setInverted(SpringScrollView view, boolean inverted) {
        view.setInverted(inverted);
    }

    @ReactProp(name = "directionalLockEnabled")
    public void setDirectionalLockEnabled(SpringScrollView view, boolean directionalLockEnabled) {
        view.setDirectionalLockEnabled(directionalLockEnabled);
    }

    @ReactProp(name = "pagingEnabled")
    public void setPagingEnabled(SpringScrollView view, boolean pagingEnabled) {
        view.setPagingEnabled(pagingEnabled);
    }

    @ReactProp(name = "pageSize")
    public void setPageSize(SpringScrollView view, ReadableMap pageSize) {
        float width = pageSize != null ? PixelUtil.toPixelFromDIP( pageSize.getDouble("width")) : 0f;
        float height = pageSize != null ? PixelUtil.toPixelFromDIP( pageSize.getDouble("height")) : 0f;
        view.setPageSize(width, height);
    }

    @Nullable
    @Override
    public Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.of(
                "onScroll", MapBuilder.of("registrationName", "onScroll"),
                "onCustomTouchBegin", MapBuilder.of("registrationName", "onCustomTouchBegin"),
                "onCustomTouchEnd", MapBuilder.of("registrationName", "onCustomTouchEnd"),
                "onCustomMomentumScrollBegin", MapBuilder.of("registrationName", "onCustomMomentumScrollBegin"),
                "onCustomMomentumScrollEnd", MapBuilder.of("registrationName", "onCustomMomentumScrollEnd"),
                "onCustomScrollBeginDrag", MapBuilder.of("registrationName", "onCustomScrollBeginDrag"),
                "onCustomScrollEndDrag", MapBuilder.of("registrationName", "onCustomScrollEndDrag")
        );

    }

    @Override
    public void receiveCommand(@NonNull View root, String commandId, @Nullable ReadableArray args) {
        SpringScrollView scrollView = (SpringScrollView) root;
        switch (commandId) {
            case "10000":
                scrollView.endRefresh();
                break;
            case "10001":
                scrollView.endLoading(args.getBoolean(0));
                break;
            case "10002":
                scrollView.scrollTo(
                        PixelUtil.toPixelFromDIP(args.getDouble(0)),
                        PixelUtil.toPixelFromDIP(args.getDouble(1)),
                        args.getBoolean(2));
                break;
        }
    }
}
