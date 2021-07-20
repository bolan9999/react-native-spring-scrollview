package com.bolan9999;

import android.content.Context;
import android.os.Build;
//import android.support.annotation.NonNull;
import android.util.Log;
import android.view.MotionEvent;
import android.view.VelocityTracker;
import android.view.ViewGroup;
import android.view.View;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.NativeGestureUtil;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.scroll.ReactScrollViewHelper;
import com.facebook.react.views.view.ReactViewGroup;

public class SpringScrollView extends ReactViewGroup implements View.OnLayoutChangeListener, DecelerateListener {
    private float refreshHeaderHeight, loadingFooterHeight;
    private boolean momentumScrolling, bounces, scrollEnabled, dragging, inverted,
            directionalLockEnabled, pagingEnabled;
    private VelocityTracker tracker;
    private DecelerateAnimation verticalAnimation, horizontalAnimation;
    private String refreshStatus, loadingStatus, draggingDirection;
    private Offset contentOffset, initContentOffset;
    private Size size, contentSize, pageSize;
    private Point lastPoint, beginPoint;
    private EdgeInsets contentInsets;

    public SpringScrollView(Context context) {
        super(context);
        refreshStatus = loadingStatus = "waiting";
        initContentOffset = new Offset();
        contentOffset = new Offset();
        contentInsets = new EdgeInsets();
        size = new Size();
        contentSize = new Size();
        lastPoint = new Point();
        beginPoint = new Point();
        pageSize = new Size();
        setClipChildren(false);
        verticalAnimation = new DecelerateAnimation(this);
        horizontalAnimation = new DecelerateAnimation(this);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            setClipToOutline(true);
        }
    }

    @Override
    public void onDecelerateUpdate(DecelerateAnimation animation, float value) {
        if (animation == verticalAnimation) {
            moveToOffset(contentOffset.x, value);
        } else {
            moveToOffset(value, contentOffset.y);
        }
    }

    @Override
    public void onDecelerateEnd(DecelerateAnimation animation) {
        animation.setExtraListener(null);
        if (animation == verticalAnimation) {
            onVerticalAnimationEnd();
        } else {
            onHorizontalAnimationEnd();
        }
    }

    @Override
    protected void onAttachedToWindow() {
        addOnLayoutChangeListener(this);
        ViewGroup child = (ViewGroup) getChildAt(0);
        if (child != null) {
            if (initContentOffset.y != 0) {
                setContentOffset(initContentOffset.x, initContentOffset.y);
            }
            child.addOnLayoutChangeListener(this);
            child.setClipChildren(false);
        }
        super.onAttachedToWindow();
    }

    @Override
    protected void onDetachedFromWindow() {
        setOnTouchListener(null);
        removeOnLayoutChangeListener(this);
        View child = getChildAt(0);
        if (child != null) {
            child.removeOnLayoutChangeListener(this);
        }
        super.onDetachedFromWindow();
    }

    @Override
    public void onLayoutChange(View view, int i, int i1, int i2, int i3, int i4, int i5, int i6, int i7) {
        if (this == view) {
            size.width = i2 - i;
            size.height = i3 - i1;
        } else {
            setContentSize(i2 - i, i3 - i1);
        }
    }

    @Override
    public boolean onInterceptTouchEvent(MotionEvent ev) {
        if (!scrollEnabled) return super.onInterceptTouchEvent(ev);
        int action = ev.getAction() & MotionEvent.ACTION_MASK;
        switch (action) {
            case MotionEvent.ACTION_DOWN:
                onDown(ev);
                final int[] location = new int[2];
                getLocationOnScreen(location);
                break;
            case MotionEvent.ACTION_MOVE:
                if (dragging || (!this.shouldChildrenInterceptTouchEvent(this, ev) && shouldDrag(ev, false))) {
                    if (!dragging) {
                        sendEvent("onCustomScrollBeginDrag", null);
                    }
                    dragging = true;
                    getParent().requestDisallowInterceptTouchEvent(true);
                }
                break;
            case MotionEvent.ACTION_UP:
            case MotionEvent.ACTION_CANCEL:
                if (!dragging) sendEvent("onCustomTouchEnd", null);
                break;
        }
        return dragging || super.onInterceptTouchEvent(ev);
    }

    private boolean shouldChildrenInterceptTouchEvent(ViewGroup parent, MotionEvent ev) {
        for (int i = 0; i < parent.getChildCount(); i++) {
            View child = parent.getChildAt(i);
            if (child instanceof ViewGroup && this.shouldChildrenInterceptTouchEvent((ViewGroup) child, ev)) {
                return true;
            }
            if ((child instanceof SpringScrollView) && ((SpringScrollView) child).shouldDrag(ev, true)) {
                return true;
            }
        }
        return false;
    }

    private boolean shouldDrag(MotionEvent ev, boolean child) {
        if (!scrollEnabled) return false;
        if (beginPoint.x == 0 && beginPoint.y == 0) return false;
        if (dragging) return true;
        float offsetX = ev.getRawX() - beginPoint.x;
        float offsetY = ev.getRawY() - beginPoint.y;
        if (inverted) {
            offsetX = -offsetX;
            offsetY = -offsetY;
        }
        if (canHorizontalScroll()) {
            if (child) {
                if (contentOffset.x == -contentInsets.left && offsetX > 0)
                    return false;
                if (contentOffset.x == contentInsets.right + contentSize.width - size.width && offsetX < 0)
                    return false;
            } else if (Math.abs(offsetX) > PixelUtil.toPixelFromDIP(10)) {
                return true;
            }
        }
        if (child) {
            if (contentOffset.y == -contentInsets.top && offsetY > 0) {
                return false;
            }
            if (contentOffset.y == contentSize.height - size.height && offsetY < 0)
                return false;
        }
        return Math.abs(offsetY) > PixelUtil.toPixelFromDIP(5);
    }

    @Override
    public boolean onTouchEvent(MotionEvent evt) {
        switch (evt.getAction() & MotionEvent.ACTION_MASK) {
            case MotionEvent.ACTION_MOVE:
                onMove(evt);
                break;
            case MotionEvent.ACTION_UP:
            case MotionEvent.ACTION_CANCEL:
                onUp(evt);
                break;
        }
        return dragging;
    }

    private void onDown(MotionEvent evt) {
        beginPoint.x = lastPoint.x = evt.getRawX();
        beginPoint.y = lastPoint.y = evt.getRawY();
        if (cancelAllAnimations()) {
            dragging = true;
        }
        sendEvent("onCustomTouchBegin", null);
        tracker = VelocityTracker.obtain();
    }

    private void onMove(MotionEvent evt) {
        if (!scrollEnabled) return;
        if (inverted) drag(evt.getRawX() - lastPoint.x, evt.getRawY() - lastPoint.y);
        else drag(lastPoint.x - evt.getRawX(), lastPoint.y - evt.getRawY());
        lastPoint.x = evt.getRawX();
        lastPoint.y = evt.getRawY();
        tracker.addMovement(evt);
    }

    private void onUp(MotionEvent evt) {
        dragging = false;
        sendEvent("onCustomTouchEnd", null);
        sendEvent("onCustomScrollEndDrag", null);
        beginPoint.x = beginPoint.y = 0;
        tracker.computeCurrentVelocity(1);
        float vy = tracker.getYVelocity();
        float vx = tracker.getXVelocity();
        if (draggingDirection != null && draggingDirection.equals("h")) vy = 0;
        else if (draggingDirection != null && draggingDirection.equals("v")) vx = 0;
        draggingDirection = null;
        tracker.recycle();
        if (shouldLoad()) {
            loadingStatus = "loading";
            contentInsets.bottom = loadingFooterHeight;
        }
        getParent().requestDisallowInterceptTouchEvent(false);
        if (!scrollEnabled) return;
        if (overshootVertical()) {
            beginOuterAnimation(vy);
        } else {
            beginInnerAnimation(vy);
        }
        if (contentSize.width <= size.width) return;
        if (overshootHorizontal()) {
            beginOuterHorizontalAnimation(vx);
        } else {
            beginInnerHorizontalAnimation(vx);
        }
    }

    private void beginInnerHorizontalAnimation(final float initialVelocity) {
        if (!momentumScrolling) {
            momentumScrolling = true;
            sendEvent("onCustomMomentumScrollBegin", null);
        }
        final long beginTimeInterval = System.currentTimeMillis();
        final float dampingCoefficient = pagingEnabled ? 0.99f : 0.997f;
        float end;
        float displacement = 0;
        float v = initialVelocity;
        int duration = 0;
        while (Math.abs(v) > 0.01f) {
            displacement += v;
            v *= dampingCoefficient;
            duration++;
        }
        if (pagingEnabled) {
            duration = 500;
            end = Math.round((contentOffset.x - displacement) / getPageWidth()) * getPageWidth();
        } else {
            end = contentOffset.x - displacement;
        }
        horizontalAnimation.config(contentOffset.x, end, duration);
        horizontalAnimation.setExtraListener(new DecelerateListener() {
            @Override
            public void onDecelerateUpdate(DecelerateAnimation animation, float value) {
                if (overshootHorizontal()) {
                    long interval = System.currentTimeMillis() - beginTimeInterval;
                    float v = initialVelocity;
                    while (interval-- > 0) {
                        v *= dampingCoefficient;
                    }
                    animation.cancel();
                    beginOuterHorizontalAnimation(v);
                }
            }

            @Override
            public void onDecelerateEnd(DecelerateAnimation animation) {
            }
        });
        horizontalAnimation.start();
    }

    private void beginOuterHorizontalAnimation(float initialVelocity) {
        if (Math.abs(initialVelocity) < 0.1f) {
            beginHorizontalReboundAnimation();
            return;
        }
        if (initialVelocity > 15) initialVelocity = 15;
        if (initialVelocity < -15) initialVelocity = -15;
        horizontalAnimation.configFromSpeed(contentOffset.x, initialVelocity, 0.9f, false);
        horizontalAnimation.setExtraListener(new DecelerateListener() {
            @Override
            public void onDecelerateUpdate(DecelerateAnimation animation, float value) {
            }

            @Override
            public void onDecelerateEnd(DecelerateAnimation animation) {
                beginHorizontalReboundAnimation();
            }
        });
        horizontalAnimation.start();
    }

    private void beginHorizontalReboundAnimation() {
        if (!overshootHorizontal() || !bounces) {
            return;
        }
        float endValue = overshootLeft() ? -contentInsets.left : contentSize.width - size.width + contentInsets.right;
        horizontalAnimation.config(contentOffset.x, endValue, 500);
        horizontalAnimation.start();
    }

    private void beginInnerAnimation(final float initialVelocity) {
        if (!momentumScrolling) {
            momentumScrolling = true;
            sendEvent("onCustomMomentumScrollBegin", null);
        }
        final long beginTimeInterval = System.currentTimeMillis();
        float end;
        final float dampingCoefficient = pagingEnabled ? 0.99f : 0.997f;
        float displacement = 0;
        float v = initialVelocity;
        int duration = 0;
        while (Math.abs(v) > 0.01f) {
            displacement += v;
            v *= dampingCoefficient;
            duration++;
        }
        if (pagingEnabled) {
            duration = 500;
            end = Math.round((contentOffset.y - displacement) / getPageHeight()) * getPageHeight();
        } else {
            end = contentOffset.y - displacement;
        }
        verticalAnimation.config(contentOffset.y, end, duration);
        verticalAnimation.setExtraListener(new DecelerateListener() {
            @Override
            public void onDecelerateUpdate(DecelerateAnimation animation, float value) {
                if (overshootHead() || overshootFooter()) {
                    long interval = System.currentTimeMillis() - beginTimeInterval;
                    float v = initialVelocity;
                    while (interval-- > 0) {
                        v *= dampingCoefficient;
                    }
                    animation.cancel();
                    beginOuterAnimation(v);
                }
            }

            @Override
            public void onDecelerateEnd(DecelerateAnimation animation) {
            }
        });
        verticalAnimation.start();
    }

    private void beginOuterAnimation(float initialVelocity) {
        if (Math.abs(initialVelocity) < 0.1f) {
            beginReboundAnimation();
            return;
        }
        if (initialVelocity > 15) initialVelocity = 15;
        if (initialVelocity < -15) initialVelocity = -15;
        verticalAnimation.configFromSpeed(contentOffset.y, initialVelocity, 0.9f, false);
        verticalAnimation.setExtraListener(new DecelerateListener() {
            @Override
            public void onDecelerateUpdate(DecelerateAnimation animation, float value) {
            }

            @Override
            public void onDecelerateEnd(DecelerateAnimation animation) {
                beginReboundAnimation();
            }
        });
        verticalAnimation.start();
    }

    private void beginReboundAnimation() {
        if (!overshootVertical() || !bounces) {
            return;
        }
        float endValue = overshootHead() ? -contentInsets.top : contentSize.height - size.height + contentInsets.bottom;
        verticalAnimation.config(contentOffset.y, endValue, 500);
        verticalAnimation.start();
    }

    private void onVerticalAnimationEnd() {
        if (!horizontalAnimation.animating && momentumScrolling) {
            momentumScrolling = false;
            sendEvent("onCustomMomentumScrollEnd", null);
        }
    }

    private void onHorizontalAnimationEnd() {
        if (!verticalAnimation.animating && momentumScrolling) {
            momentumScrolling = false;
            sendEvent("onCustomMomentumScrollEnd", null);
        }
    }

    private boolean cancelAllAnimations() {
        boolean cancelVertical = false;
        boolean cancelHorizontal = false;
        if (verticalAnimation.animating) {
            cancelVertical = verticalAnimation.cancel();
        }
        if (horizontalAnimation.animating) {
            cancelHorizontal = horizontalAnimation.cancel();
        }
        return cancelVertical || cancelHorizontal;
    }


    private void drag(float x, float y) {
        y *= getYDampingCoefficient();
        x *= getXDampingCoefficient();
        if (directionalLockEnabled) {
            if (draggingDirection == null) {
                if (Math.abs(x) > Math.abs(y)) {
                    draggingDirection = "h";
                } else {
                    draggingDirection = "v";
                }
            }
            if (draggingDirection.equals("h")) y = 0;
            if (draggingDirection.equals("v")) x = 0;
        }
        moveToOffset(contentOffset.x + x, contentOffset.y + y);
    }

    private float getYDampingCoefficient() {
        return overshootVertical() ? 0.5f : 1f;
    }

    private float getXDampingCoefficient() {
        return overshootLeft() || overshootRight() ? 0.5f : 1;
    }

    private void moveToOffset(float x, float y) {
        if (!scrollEnabled) return;
        if (!bounces) {
            if (y < -contentInsets.top) y = -contentInsets.top;
            if (y > contentSize.height - size.height + contentInsets.bottom)
                y = contentSize.height - size.height + contentInsets.bottom;
        }
        if (contentSize.width <= size.width || !bounces) {
            if (x < -contentInsets.left) x = -contentInsets.left;
            if (x > contentSize.width - size.width + contentInsets.right)
                x = contentSize.width - size.width + contentInsets.right;
        }
        if (contentOffset.y == y && contentOffset.x == x) return;
        if (shouldPulling()) {
            refreshStatus = "pulling";
        } else if (shouldPullingEnough()) {
            refreshStatus = "pullingEnough";
        } else if (shouldRefresh()) {
            refreshStatus = "refreshing";
            contentInsets.top = refreshHeaderHeight;
        } else if (shouldPullingCancel()) {
            refreshStatus = "pullingCancel";
        } else if (shouldWaiting()) {
            refreshStatus = "waiting";
        }
        if (shouldDragging()) {
            loadingStatus = "dragging";
        } else if (shouldDraggingEnough()) {
            loadingStatus = "draggingEnough";
        } else if (shouldDraggingCancel()) {
            loadingStatus = "draggingCancel";
        } else if (shouldFooterWaiting()) {
            loadingStatus = "waiting";
        }
        setContentOffset(x, y);
    }

    public void setContentOffset(float x, float y) {
        if (contentOffset.x == x && contentOffset.y == y) return;
        contentOffset.x = x;
        contentOffset.y = y;
        View child = getChildAt(0);
        if (child != null) {
            child.setTranslationX(-contentOffset.x);
            child.setTranslationY(-contentOffset.y);
        }
        WritableMap event = Arguments.createMap();
        WritableMap contentOffsetMap = Arguments.createMap();
        contentOffsetMap.putDouble("x", PixelUtil.toDIPFromPixel(contentOffset.x));
        contentOffsetMap.putDouble("y", PixelUtil.toDIPFromPixel(contentOffset.y));
        event.putMap("contentOffset", contentOffsetMap);
        event.putString("refreshStatus", refreshStatus);
        event.putString("loadingStatus", loadingStatus);
        sendOnScrollEvent(event);
    }

    private boolean overshootVertical() {
        return overshootHead() || overshootFooter();
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        super.onLayout(changed, left, top, right, bottom);
        View child = getChildAt(0);
        assert child != null;
        size.width = getWidth();
        size.height = getHeight();

        setContentSize(child.getMeasuredWidth(), child.getMeasuredHeight());
    }

    private void setContentSize(float width, float height) {
        if (height < size.height) height = size.height;
        if (width < size.width) width = size.width;
        contentSize.width = width;
        contentSize.height = height;
    }

    public void setRefreshHeaderHeight(float height) {
        refreshHeaderHeight = height;
    }

    public void setLoadingFooterHeight(float height) {
        loadingFooterHeight = height;
    }

    private void sendOnScrollEvent(WritableMap param) {
        if (param == null) param = Arguments.createMap();
        EventDispatcher eventDispatcher = ((ReactContext) getContext())
                .getNativeModule(UIManagerModule.class)
                .getEventDispatcher();
        eventDispatcher.dispatchEvent(ScrollEvent.obtain(getId(), param));
    }

    private void sendEvent(String evtName, WritableMap event) {
        if (event == null) event = Arguments.createMap();
        ((ReactContext) getContext()).getJSModule(RCTEventEmitter.class).receiveEvent(getId(), evtName, event);
    }

    public void endRefresh() {
        if (!refreshStatus.equals("refreshing")) return;
        refreshStatus = "rebound";
        if (verticalAnimation.animating) verticalAnimation.cancel();
        contentInsets.top = 0;
        verticalAnimation.config(contentOffset.y, 0, 500);
        verticalAnimation.start();
    }

    public void endLoading(boolean rebound) {
        if (!loadingStatus.equals("loading")) return;
        loadingStatus = rebound ? "rebound" : "waiting";
        if (verticalAnimation.animating) verticalAnimation.cancel();
        verticalAnimation.config(contentOffset.y,
                contentSize.height - size.height + (rebound ? 0 : contentInsets.bottom), 500);
        verticalAnimation.setExtraListener(new DecelerateListener() {
            @Override
            public void onDecelerateUpdate(DecelerateAnimation animation, float value) {
            }

            @Override
            public void onDecelerateEnd(DecelerateAnimation animation) {
                if (loadingStatus.equals("rebound")) loadingStatus = "waiting";
            }
        });
        contentInsets.bottom = 0;
        verticalAnimation.start();
    }

    public void setAllLoaded(boolean allLoaded) {
        loadingStatus = allLoaded ? "allLoaded" : "waiting";
        if (allLoaded) {
            contentInsets.bottom = 0;
        }
    }

    public void scrollTo(float x, float y, boolean animated) {
        cancelAllAnimations();
        if (!animated) {
            moveToOffset(x, y);
            return;
        }
        verticalAnimation.config(contentOffset.y, y, 500);
        verticalAnimation.start();
        if (x != contentOffset.x) {
            horizontalAnimation.config(contentOffset.x, x, 500);
            horizontalAnimation.start();
        }
    }

    public void setBounces(boolean bounces) {
        this.bounces = bounces;
    }

    public void setScrollEnabled(boolean scrollEnabled) {
        this.scrollEnabled = scrollEnabled;
    }

    public void setInitContentOffset(float x, float y) {
        initContentOffset.x = x;
        initContentOffset.y = y;
    }

    public void setInverted(boolean inverted) {
        this.inverted = inverted;
    }

    public void setDirectionalLockEnabled(boolean directionalLockEnabled) {
        this.directionalLockEnabled = directionalLockEnabled;
    }

    public void setPagingEnabled(boolean pagingEnabled) {
        this.pagingEnabled = pagingEnabled;
    }

    public void setPageSize(float width, float height) {
        this.pageSize.width = width;
        this.pageSize.height = height;
    }

    private float getPageWidth() {
        return pageSize.width <= 0 ? size.width : pageSize.width;
    }

    private float getPageHeight() {
        return pageSize.height <= 0 ? size.height : pageSize.height;
    }

    private boolean overshootHead() {
        return contentOffset.y < -contentInsets.top;
    }

    private boolean overshootRefresh() {
        return contentOffset.y < -contentInsets.top - refreshHeaderHeight;
    }

    private boolean overshootFooter() {
        return contentOffset.y > contentSize.height - size.height;
    }

    private boolean overshootLoading() {
        return contentOffset.y > -size.height + contentSize.height + loadingFooterHeight;
    }

    private boolean overshootLeft() {
        return contentOffset.x < -contentInsets.left;
    }

    private boolean overshootRight() {
        return contentOffset.x > contentInsets.right + contentSize.width - size.width;
    }

    private boolean overshootHorizontal() {
        return overshootLeft() || overshootRight();
    }

    private boolean shouldPulling() {
        return refreshHeaderHeight > 0 && overshootHead() &&
                (refreshStatus.equals("waiting") || refreshStatus.equals("pullingCancel"));
    }

    private boolean shouldPullingEnough() {
        return refreshHeaderHeight > 0 && overshootRefresh() &&
                refreshStatus.equals("pulling");
    }

    private boolean shouldRefresh() {
        return refreshHeaderHeight > 0 && overshootRefresh() && refreshStatus.equals("pullingEnough");
    }

    private boolean shouldPullingCancel() {
        return refreshHeaderHeight > 0 && refreshStatus.equals("pullingEnough")
                && overshootHead() && !overshootRefresh();
    }

    private boolean shouldWaiting() {
        return refreshHeaderHeight > 0 && !overshootHead() &&
                (refreshStatus.equals("rebound") || refreshStatus.equals("pullingCancel"));
    }

    private boolean shouldDragging() {
        return loadingFooterHeight > 0 && overshootFooter() &&
                (loadingStatus.equals("waiting") || loadingStatus.equals("draggingCancel"));
    }

    private boolean shouldDraggingEnough() {
        return loadingFooterHeight > 0 && overshootLoading() && loadingStatus.equals("dragging");
    }

    private boolean shouldLoad() {
        return loadingFooterHeight > 0 && overshootLoading() && loadingStatus.equals("draggingEnough");
    }

    private boolean shouldDraggingCancel() {
        return loadingFooterHeight > 0 && loadingStatus.equals("draggingEnough") &&
                overshootFooter() && !overshootLoading();
    }

    private boolean shouldFooterWaiting() {
        return loadingFooterHeight > 0 && !overshootFooter() &&
                (loadingStatus.equals("rebound") || loadingStatus.equals("draggingCancel"));
    }

    private boolean canHorizontalScroll() {
        return scrollEnabled && contentSize.width > size.width;
    }
}
