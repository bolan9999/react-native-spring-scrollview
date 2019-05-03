package com.bolan9999;

import android.content.Context;
import android.os.Build;
import android.support.annotation.NonNull;
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

public class SpringScrollView extends ReactViewGroup implements View.OnTouchListener,
        View.OnLayoutChangeListener {
    private float refreshHeaderHeight, loadingFooterHeight;
    private boolean momentumScrolling, bounces, scrollEnabled, dragging, inverted,
            directionalLockEnabled;
    private VelocityTracker tracker;
    private DecelerateAnimation verticalAnimation, horizontalAnimation;
    private String refreshStatus, loadingStatus, draggingDirection;
    private Offset contentOffset, initContentOffset;
    private Size size, contentSize;
    private Point lastPoint, beginPoint;
    private EdgeInsets contentInsets;

    public SpringScrollView(@NonNull Context context) {
        super(context);
        refreshStatus = loadingStatus = "waiting";
        initContentOffset = new Offset();
        contentOffset = new Offset();
        contentInsets = new EdgeInsets();
        size = new Size();
        contentSize = new Size();
        lastPoint = new Point();
        beginPoint = new Point();
        setClipChildren(false);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            setClipToOutline(true);
        }
    }

    @Override
    protected void onAttachedToWindow() {
        setOnTouchListener(this);
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
        int action = ev.getAction() & MotionEvent.ACTION_MASK;
        switch (action) {
            case MotionEvent.ACTION_DOWN:
                onDown(ev);
                return false;
            case MotionEvent.ACTION_MOVE:
                if (shouldDrag(ev)) {
                    dragging = true;
                    requestDisallowInterceptTouchEvent(true);
                    NativeGestureUtil.notifyNativeGestureStarted(this, ev);
                    ReactScrollViewHelper.emitScrollBeginDragEvent(this);
                    return true;
                }
        }
        return dragging;
    }

    private boolean shouldDrag(MotionEvent ev) {
        return dragging ||
                (canHorizontalScroll() && Math.abs(ev.getX() - beginPoint.x) > PixelUtil.toPixelFromDIP(10)) ||
                (scrollEnabled && Math.abs(ev.getY() - beginPoint.y) > PixelUtil.toPixelFromDIP(5));
    }

    @Override
    public boolean onTouch(View view, MotionEvent evt) {
        switch (evt.getAction() & MotionEvent.ACTION_MASK) {
            case MotionEvent.ACTION_MOVE:
                onMove(evt);
                break;
            case MotionEvent.ACTION_UP:
            case MotionEvent.ACTION_CANCEL:
                onUp(evt);
                break;
        }
        return true;
    }

    private void onDown(MotionEvent evt) {
        beginPoint.x = lastPoint.x = evt.getX();
        beginPoint.y = lastPoint.y = evt.getY();
        if (cancelAllAnimations()) {
            this.dragging = true;
        }
        if (momentumScrolling) {
            momentumScrolling = false;
            sendEvent("onMomentumScrollEnd", null);
        }
        sendEvent("onTouchBegin", null);
        tracker = VelocityTracker.obtain();
    }

    private void onMove(MotionEvent evt) {
        if (!scrollEnabled) return;
        drag(lastPoint.x - evt.getX(), lastPoint.y - evt.getY());
        lastPoint.x = evt.getX();
        lastPoint.y = evt.getY();
        tracker.addMovement(evt);
    }

    private void onUp(MotionEvent evt) {
        onMove(evt);
        dragging = false;
        tracker.computeCurrentVelocity(1);
        float vy = tracker.getYVelocity();
        float vx = tracker.getXVelocity();
        if (inverted && Build.VERSION.SDK_INT >= 28) {
            vx = -vx;
            vy = -vy;
        }
        if (draggingDirection != null && draggingDirection.equals("h")) vy = 0;
        else if (draggingDirection != null && draggingDirection.equals("v")) vx = 0;
        draggingDirection = null;
        tracker.clear();
        WritableMap param = Arguments.createMap();
        param.putArray("touches", Arguments.createArray());
        sendEvent("onTouchEnd", param);
        if (!momentumScrolling) {
            momentumScrolling = true;
            sendEvent("onMomentumScrollBegin", null);
        }
        if (shouldRefresh()) {
            refreshStatus = "refreshing";
            contentInsets.top = refreshHeaderHeight;
        }
        if (shouldLoad()) {
            loadingStatus = "loading";
            contentInsets.bottom = loadingFooterHeight;
        }
        requestDisallowInterceptTouchEvent(false);
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
        if (Math.abs(initialVelocity) < 0.1f) {
            return;
        }
        final long beginTimeInterval = System.currentTimeMillis();
        horizontalAnimation = new DecelerateAnimation(contentOffset.x, initialVelocity, 0.997f) {
            @Override
            protected void onEnd() {
                if (momentumScrolling) {
                    momentumScrolling = false;
                    sendEvent("onMomentumScrollEnd", null);
                }
            }

            @Override
            protected void onUpdate(float value) {
                setContentOffset(value, contentOffset.y);
                if (overshootHorizontal()) {
                    long interval = System.currentTimeMillis() - beginTimeInterval;
                    float v = initialVelocity;
                    while (interval-- > 0) {
                        v *= 0.997f;
                    }
                    animator.cancel();
                    horizontalAnimation = null;
                    beginOuterHorizontalAnimation(v);
                }
            }
        };
        horizontalAnimation.start();
    }

    private void beginOuterHorizontalAnimation(float initialVelocity) {
        if (Math.abs(initialVelocity) < 0.1f) {
            beginHorizontalReboundAnimation();
            return;
        }
        if (initialVelocity > 15) initialVelocity = 15;
        if (initialVelocity < -15) initialVelocity = -15;
        horizontalAnimation = new DecelerateAnimation(contentOffset.x, initialVelocity, 0.9f) {
            @Override
            protected void onEnd() {
                beginHorizontalReboundAnimation();
            }

            @Override
            protected void onUpdate(float value) {
                if (!bounces) {
                    contentOffset.x = value;
                    if (overshootLeft()) {
                        value = -contentInsets.left;
                        horizontalAnimation.cancel();
                    } else if (overshootRight()) {
                        value = contentSize.width - size.width + contentInsets.right;
                        horizontalAnimation.cancel();
                    }
                }
                setContentOffset(value, contentOffset.y);
            }
        };
        horizontalAnimation.start();
    }

    private void beginHorizontalReboundAnimation() {
        if (!overshootHorizontal() || !bounces) {
            return;
        }
        float endValue;
        if (overshootLeft()) {
            endValue = -contentInsets.left;
        } else {
            endValue = contentSize.width - size.width + contentInsets.right;
        }
        horizontalAnimation = new DecelerateAnimation(contentOffset.x, endValue, 500) {
            @Override
            protected void onEnd() {
                if (momentumScrolling) {
                    momentumScrolling = false;
                    sendEvent("onMomentumScrollEnd", null);
                }
            }

            @Override
            protected void onUpdate(float value) {
                setContentOffset(value, contentOffset.y);
            }
        };
        horizontalAnimation.start();
    }

    private void beginInnerAnimation(final float initialVelocity) {
        if (Math.abs(initialVelocity) < 0.1f) {
            if (momentumScrolling) {
                momentumScrolling = false;
                sendEvent("onMomentumScrollEnd", null);
            }
            return;
        }
        final long beginTimeInterval = System.currentTimeMillis();
        verticalAnimation = new DecelerateAnimation(contentOffset.y, initialVelocity, 0.997f) {
            @Override
            protected void onEnd() {
                if (momentumScrolling) {
                    momentumScrolling = false;
                    sendEvent("onMomentumScrollEnd", null);
                }
            }

            @Override
            protected void onUpdate(float value) {
                setContentOffset(contentOffset.x, value);
                if (overshootHead() || overshootFooter()) {
                    long interval = System.currentTimeMillis() - beginTimeInterval;
                    float v = initialVelocity;
                    while (interval-- > 0) {
                        v *= 0.997f;
                    }
                    animator.cancel();
                    beginOuterAnimation(v);
                }
            }
        };
        verticalAnimation.start();
    }

    private void beginOuterAnimation(float initialVelocity) {
        if (Math.abs(initialVelocity) < 0.1f) {
            beginReboundAnimation();
            return;
        }
        if (initialVelocity > 15) initialVelocity = 15;
        if (initialVelocity < -15) initialVelocity = -15;
        verticalAnimation = new DecelerateAnimation(contentOffset.y, initialVelocity, 0.9f) {
            @Override
            protected void onEnd() {
                beginReboundAnimation();
            }

            @Override
            protected void onUpdate(float value) {
                if (!bounces) {
                    contentOffset.y = value;
                    if (overshootHead()) {
                        value = -contentInsets.top;
                        verticalAnimation.cancel();
                    } else if (overshootFooter()) {
                        value = contentSize.height - size.height + contentInsets.bottom;
                        verticalAnimation.cancel();
                    }
                }
                setContentOffset(contentOffset.x, value);
            }
        };
        verticalAnimation.start();
    }

    private void beginReboundAnimation() {
        if (!overshootVertical() || !bounces) {
            return;
        }
        float endValue;
        if (overshootHead()) {
            endValue = -contentInsets.top;
        } else {
            endValue = contentSize.height - size.height + contentInsets.bottom;
        }
        verticalAnimation = new DecelerateAnimation(contentOffset.y, endValue, 500) {
            @Override
            protected void onEnd() {
                if (momentumScrolling) {
                    momentumScrolling = false;
                    sendEvent("onMomentumScrollEnd", null);
                }
            }

            @Override
            protected void onUpdate(float value) {
                setContentOffset(contentOffset.x, value);
            }
        };
        verticalAnimation.start();
    }

    private boolean cancelAllAnimations() {
        boolean cancel = false;
        if (verticalAnimation != null) {
            cancel = verticalAnimation.cancel();
            verticalAnimation = null;
        }
        if (horizontalAnimation != null) {
            cancel = horizontalAnimation.cancel();
            horizontalAnimation = null;
        }
        return cancel;
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
        if (!overshootVertical()) {
            return 1;
        }
        float overshoot = overshootHead() ? -contentOffset.y : contentOffset.y - contentSize.height + size.height;
        float c = 0.8f;
        return c / (size.height * size.height) * (overshoot * overshoot) - 2 * c / size.height * overshoot + c;
    }

    private float getXDampingCoefficient() {
        float overshoot;
        if (overshootLeft()) {
            overshoot = -contentOffset.x;
        } else if (overshootRight()) {
            overshoot = contentOffset.x - contentSize.width + size.width;
        } else {
            return 1;
        }
        float c = 0.8f;
        return c / (size.width * size.width) * (overshoot * overshoot) - 2 * c / size.width * overshoot + c;
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

    private void sendOnScrollEvent(WritableMap event) {
        if (event == null) event = Arguments.createMap();
        EventDispatcher eventDispatcher = ((ReactContext) getContext())
                .getNativeModule(UIManagerModule.class)
                .getEventDispatcher();
        eventDispatcher.dispatchEvent(ScrollEvent.obtain(getId(), "onScroll", event));
    }

    private void sendEvent(String evtName, WritableMap event) {
        if (event == null) event = Arguments.createMap();
        ((ReactContext) getContext()).getJSModule(RCTEventEmitter.class).receiveEvent(getId(), evtName, event);
    }

    public void endRefresh() {
        if (!refreshStatus.equals("refreshing")) return;
        refreshStatus = "rebound";
        if (verticalAnimation != null) verticalAnimation.cancel();
        contentInsets.top = 0;
        verticalAnimation = new DecelerateAnimation(contentOffset.y, 0, 500) {
            @Override
            protected void onUpdate(float value) {
                setContentOffset(contentOffset.x, value);
            }
        };
        verticalAnimation.start();
    }

    public void endLoading() {
        if (!loadingStatus.equals("loading")) return;
        loadingStatus = "rebound";
        if (verticalAnimation != null) verticalAnimation.cancel();
        contentInsets.bottom = 0;
        verticalAnimation = new DecelerateAnimation(contentOffset.y, contentSize.height - size.height, 500) {
            @Override
            protected void onUpdate(float value) {
                setContentOffset(contentOffset.x, value);
            }
        };
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
        verticalAnimation = new DecelerateAnimation(contentOffset.y, y, 500) {
            @Override
            protected void onEnd() {
            }

            @Override
            protected void onUpdate(float value) {
                setContentOffset(contentOffset.x, value);
            }
        };
        verticalAnimation.start();
        if (x != contentOffset.x) {
            verticalAnimation = new DecelerateAnimation(contentOffset.x, x, 500) {
                @Override
                protected void onEnd() {
                }

                @Override
                protected void onUpdate(float value) {
                    setContentOffset(value, contentOffset.y);
                }
            };
            verticalAnimation.start();
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
