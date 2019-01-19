package com.bolan9999;

import android.animation.Animator;
import android.animation.ValueAnimator;
import android.annotation.SuppressLint;
import android.content.Context;
import android.support.annotation.NonNull;
import android.view.MotionEvent;
import android.view.VelocityTracker;
import android.view.animation.DecelerateInterpolator;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.view.ReactViewGroup;

public class SpringScrollView extends ReactViewGroup implements View.OnTouchListener, View.OnLayoutChangeListener {
    private float mOffsetX, mOffsetY, mLastX, mLastY, mHeight;
    private float mContentHeight, mRefreshHeaderHeight, mLoadingFooterHeight;
    private boolean mRefreshing, mLoading, mMomentumScrolling;
    private VelocityTracker tracker;
    private ValueAnimator innerAnimation, outerAnimation, reboundAnimation, scrollToAnimation;

    @SuppressLint({"NewApi"})
    public SpringScrollView(@NonNull Context context) {
        super(context);
        setClipToOutline(true);
    }

    @Override
    protected void onAttachedToWindow() {
        setOnTouchListener(this);
        addOnLayoutChangeListener(this);
        super.onAttachedToWindow();
    }

    @Override
    protected void onDetachedFromWindow() {
        setOnTouchListener(null);
        removeOnLayoutChangeListener(this);
        super.onDetachedFromWindow();
    }

    @Override
    public void onLayoutChange(View view, int i, int i1, int i2, int i3, int i4, int i5, int i6, int i7) {
        setLayoutHeight(i3 - i1, mContentHeight);
    }

    private void onDown(MotionEvent evt) {
        mLastX = evt.getX();
        mLastY = evt.getY();
        tracker = VelocityTracker.obtain();
        cancelAllAnimations();
        if (mMomentumScrolling) {
            mMomentumScrolling = false;
            sendEvent("onMomentumScrollEnd", null);
        }
        sendEvent("onTouchBegin", null);
    }

    private void onMove(MotionEvent evt) {
        drag(evt.getX() - mLastX, evt.getY() - mLastY);
        mLastX = evt.getX();
        mLastY = evt.getY();
        tracker.addMovement(evt);
    }

    private void onUp(MotionEvent evt) {
        this.onMove(evt);
        tracker.computeCurrentVelocity(1);
        float vy = tracker.getYVelocity();
        tracker.clear();
        sendEvent("onTouchEnd", null);
        if (!mMomentumScrolling) {
            mMomentumScrolling = true;
            sendEvent("onMomentumScrollBegin", null);
        }
        if (hitEdgeY()) {
            beginOuterAnimation(vy);
        } else {
            beginInnerAnimation(vy);
        }
    }

    private void onCancel(MotionEvent evt) {
        tracker.clear();
    }

    private ValueAnimator obtainDecelerateAnimator(float initialVelocity, float dampingCoefficient) {
        float v = initialVelocity;
        int duration = 0;
        float displacement = 0;
        while (Math.abs(v) > 0.1f) {
            displacement += v;
            v *= dampingCoefficient;
            duration++;
        }
        ValueAnimator animator = ValueAnimator.ofFloat(mOffsetY, mOffsetY + displacement);
        animator.setDuration(duration);
        animator.setInterpolator(new DecelerateInterpolator(1.5f));
        animator.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
            @Override
            public void onAnimationUpdate(ValueAnimator animator) {
                setOffsetY((float) animator.getAnimatedValue());
            }
        });
        return animator;
    }

    private void beginOuterAnimation(float initialVelocity) {
        if (Math.abs(initialVelocity) < 0.1f) {
            beginReboundAnimation();
            return;
        }
        if (initialVelocity > 15) initialVelocity = 15;
        if (initialVelocity < -15) initialVelocity = -15;
        outerAnimation = obtainDecelerateAnimator(initialVelocity, 0.9f);
        outerAnimation.addListener(new Animator.AnimatorListener() {
            @Override
            public void onAnimationStart(Animator animator) {

            }

            @Override
            public void onAnimationEnd(Animator animator) {
                beginReboundAnimation();
            }

            @Override
            public void onAnimationCancel(Animator animator) {
                beginReboundAnimation();
            }

            @Override
            public void onAnimationRepeat(Animator animator) {

            }
        });
        outerAnimation.start();
    }

    private void beginInnerAnimation(final float initialVelocity) {
        if (Math.abs(initialVelocity) < 0.1f) {
            if (mMomentumScrolling) {
                mMomentumScrolling = false;
                sendEvent("onMomentumScrollEnd", null);
            }
            return;
        }
        final long beginTimeInterval = System.currentTimeMillis();
        innerAnimation = obtainDecelerateAnimator(initialVelocity, 0.997f);
        innerAnimation.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
            @Override
            public void onAnimationUpdate(ValueAnimator animator) {
                float value = (float) animator.getAnimatedValue();
                if (value > 0 || value < mHeight - mContentHeight) {
                    long interval = System.currentTimeMillis() - beginTimeInterval;
                    float v = initialVelocity;
                    while (interval-- > 0) {
                        v *= 0.997f;
                    }
                    animator.cancel();
                    beginOuterAnimation(v);
                }
            }
        });
        innerAnimation.addListener(new Animator.AnimatorListener() {
            @Override
            public void onAnimationStart(Animator animator) {

            }

            @Override
            public void onAnimationEnd(Animator animator) {
                if (mMomentumScrolling) {
                    mMomentumScrolling = false;
                    sendEvent("onMomentumScrollEnd", null);
                }
            }

            @Override
            public void onAnimationCancel(Animator animator) {

            }

            @Override
            public void onAnimationRepeat(Animator animator) {

            }
        });
        innerAnimation.start();
    }

    private void beginReboundAnimation() {
        if (!hitEdgeY()) {
            return;
        }
        float endValue;
        if (mOffsetY > 0) {
            endValue = 0;
            if (mRefreshHeaderHeight > 0 && mOffsetY > mRefreshHeaderHeight) {
                endValue += mRefreshHeaderHeight;
                WritableMap event = Arguments.createMap();
                if (!mRefreshing) sendEvent("onRefresh", event);
                mRefreshing = true;
            }
        } else {
            endValue = mHeight - mContentHeight;
            if (mLoadingFooterHeight > 0 && mOffsetY < mHeight - mContentHeight - mRefreshHeaderHeight) {
                endValue -= mLoadingFooterHeight;
                WritableMap event = Arguments.createMap();
                if (!mLoading) sendEvent("onLoading", event);
                mLoading = true;
            }
        }
        reboundAnimation = ValueAnimator.ofFloat(mOffsetY, endValue);
        reboundAnimation.setDuration(500);
        reboundAnimation.setInterpolator(new DecelerateInterpolator(1.5f));
        reboundAnimation.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
            @Override
            public void onAnimationUpdate(ValueAnimator animator) {
                setOffsetY((float) animator.getAnimatedValue());
            }
        });
        reboundAnimation.addListener(new Animator.AnimatorListener() {
            @Override
            public void onAnimationStart(Animator animator) {

            }

            @Override
            public void onAnimationEnd(Animator animator) {
                if (mMomentumScrolling) {
                    mMomentumScrolling = false;
                    sendEvent("onMomentumScrollEnd", null);
                }
            }

            @Override
            public void onAnimationCancel(Animator animator) {
                this.onAnimationEnd(animator);
            }

            @Override
            public void onAnimationRepeat(Animator animator) {

            }
        });
        reboundAnimation.start();
    }

    private void cancelAllAnimations() {
        if (innerAnimation != null) {
            innerAnimation.cancel();
            innerAnimation = null;
        }
        if (outerAnimation != null) {
            outerAnimation.cancel();
            outerAnimation = null;
        }
        if (reboundAnimation != null) {
            reboundAnimation.cancel();
            reboundAnimation = null;
        }
        if (scrollToAnimation != null) {
            scrollToAnimation.cancel();
            scrollToAnimation = null;
        }
    }


    private void drag(float x, float y) {
        y *= getDampingCoefficient();
        setOffsetY(mOffsetY + y);
    }

    private float getDampingCoefficient() {
        if (!hitEdgeY()) {
            return 1;
        }
        float overshoot = mOffsetY > 0 ? mOffsetY : mHeight - mContentHeight - mOffsetY;
        float c = 0.8f;
        return c / (mHeight * mHeight) * (overshoot * overshoot) - 2 * c / mHeight * overshoot + c;
    }

    public void setOffsetY(float y) {
        mOffsetY = y;
        View child = getChildAt(0);
        if (child != null) child.setTranslationY(mOffsetY);
        WritableMap event = Arguments.createMap();
        event.putDouble("offsetY", -PixelUtil.toDIPFromPixel(y));
        sendEvent("onScroll", event);
    }

    @Override
    public boolean onInterceptTouchEvent(MotionEvent ev) {
        return true;
    }

    @Override
    public boolean onTouch(View view, MotionEvent evt) {
        switch (evt.getAction()) {
            case MotionEvent.ACTION_DOWN:
                onDown(evt);
                break;
            case MotionEvent.ACTION_MOVE:
                onMove(evt);
                break;
            case MotionEvent.ACTION_UP:
                onUp(evt);
                break;
            case MotionEvent.ACTION_CANCEL:
                onCancel(evt);
                break;
        }
        return true;
    }

    private boolean hitEdgeY() {
        return mOffsetY > 0 || mOffsetY < mHeight - mContentHeight;
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        super.onLayout(changed, left, top, right, bottom);
        View child = getChildAt(0);
        assert child != null;
        float contentHeight = child.getMeasuredHeight();
        setLayoutHeight(getHeight(), contentHeight);
        child.addOnLayoutChangeListener(new OnLayoutChangeListener() {
            @Override
            public void onLayoutChange(View view, int i, int i1, int i2, int i3, int i4, int i5, int i6, int i7) {
                setLayoutHeight(mHeight, i3 - i1);
            }
        });
    }

    private void setLayoutHeight(float height, float contentHeight) {
        if (mHeight != height || mContentHeight != contentHeight) {
            mHeight = height;
            mContentHeight = contentHeight;
            if (mContentHeight < mHeight) mContentHeight = mHeight;
            WritableMap evt = Arguments.createMap();
            evt.putDouble("height", PixelUtil.toDIPFromPixel(mHeight));
            evt.putDouble("contentHeight", PixelUtil.toDIPFromPixel(mContentHeight));
            sendEvent("onLayoutChange", evt);
        }
    }

    public void setRefreshHeaderHeight(float height) {
        mRefreshHeaderHeight = PixelUtil.toPixelFromDIP(height);
    }

    public void setLoadingFooterHeight(float height) {
        mLoadingFooterHeight = PixelUtil.toPixelFromDIP(height);
    }

    private void sendEvent(final String evtName, WritableMap event) {
        if (event == null) event = Arguments.createMap();
        EventDispatcher eventDispatcher = ((ReactContext) getContext())
                .getNativeModule(UIManagerModule.class)
                .getEventDispatcher();
        eventDispatcher.dispatchEvent(ScrollEvent.obtain(getId(), evtName, event));
    }

    public void endRefresh() {
        reboundAnimation = ValueAnimator.ofFloat(mOffsetY, 0);
        reboundAnimation.setDuration(500);
        reboundAnimation.setInterpolator(new DecelerateInterpolator(1.5f));
        reboundAnimation.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
            @Override
            public void onAnimationUpdate(ValueAnimator animator) {
                setOffsetY((float) animator.getAnimatedValue());
            }
        });
        reboundAnimation.addListener(new Animator.AnimatorListener() {
            @Override
            public void onAnimationStart(Animator animator) {

            }

            @Override
            public void onAnimationEnd(Animator animator) {
                mRefreshing = false;
            }

            @Override
            public void onAnimationCancel(Animator animator) {
                mRefreshing = false;
            }

            @Override
            public void onAnimationRepeat(Animator animator) {

            }
        });
        reboundAnimation.start();
    }

    public void endLoading() {
        reboundAnimation = ValueAnimator.ofFloat(mOffsetY, mHeight - mContentHeight);
        reboundAnimation.setDuration(500);
        reboundAnimation.setInterpolator(new DecelerateInterpolator(1.5f));
        reboundAnimation.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
            @Override
            public void onAnimationUpdate(ValueAnimator animator) {
                setOffsetY((float) animator.getAnimatedValue());
            }
        });
        reboundAnimation.addListener(new Animator.AnimatorListener() {
            @Override
            public void onAnimationStart(Animator animator) {

            }

            @Override
            public void onAnimationEnd(Animator animator) {
                mLoading = false;
            }

            @Override
            public void onAnimationCancel(Animator animator) {
                mLoading = false;
            }

            @Override
            public void onAnimationRepeat(Animator animator) {

            }
        });
        reboundAnimation.start();
    }

    public void scrollTo(float x, float y, boolean animated) {
        y = PixelUtil.toPixelFromDIP(-y);
        if (!animated) {
            setOffsetY(y);
            return;
        }
        scrollToAnimation = ValueAnimator.ofFloat(mOffsetY, y);
        scrollToAnimation.setDuration(500);
        scrollToAnimation.setInterpolator(new DecelerateInterpolator(1.5f));
        scrollToAnimation.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
            @Override
            public void onAnimationUpdate(ValueAnimator animator) {
                setOffsetY((float) animator.getAnimatedValue());
            }
        });
        scrollToAnimation.start();
    }
}
