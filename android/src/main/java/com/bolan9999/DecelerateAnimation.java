package com.bolan9999;


import android.animation.Animator;
import android.animation.ValueAnimator;
import android.view.animation.DecelerateInterpolator;

interface SpringAnimatorListener {
    void onUpdate(SpringAnimator animation, float value);

    void onInnerEnd(SpringAnimator animation, float stopVelocity);

    void onOuterEnd(SpringAnimator animation);

    void onReboundEnd(SpringAnimator animation);
}

class SpringAnimator implements ValueAnimator.AnimatorUpdateListener, Animator.AnimatorListener {
    protected ValueAnimator inner;
    protected ValueAnimator outer;
    protected ValueAnimator rebound;
    protected float initialVelocity;
    protected float dampingCoefficient;
    protected float from;
    protected float innerStopVelocity;
    public boolean animating, canceling;
    private SpringAnimatorListener listener;

    void startInner(float f, final float v0, final float d, float lower, float upper, boolean pagingEnabled, float pageSize) {
        from = f;
        initialVelocity = v0;
        dampingCoefficient = d;
        float displacement = 0;
        float v = initialVelocity;
        int duration = 0;
        while (Math.abs(v) > 0.1f) {
            v *= dampingCoefficient;
            displacement += v;
            duration++;
            if (from + displacement >= upper) {
                displacement = upper - from;
                break;
            } else if (from + displacement <= lower) {
                displacement = lower - from;
                break;
            }
        }
        innerStopVelocity = v;
        if (pagingEnabled) {
            float end = Math.round((f + displacement) / pageSize) * pageSize;
            if (end > upper) end = upper;
            if (end < lower) end = lower;
            this.startRebound(f, end, 500);
        } else {
            inner.setFloatValues(0, displacement);
            inner.setDuration(duration);
            if (duration > 0) inner.start();
            else listener.onInnerEnd(this, v);
        }
    }

    void startOuter(float f, float v0, float d) {
        from = f;
        initialVelocity = v0;
        dampingCoefficient = d;
        float displacement = 0;
        float v = initialVelocity;
        int duration = 0;
        while (Math.abs(v) > 0.1f) {
            v *= dampingCoefficient;
            displacement += v;
            duration++;
        }
        outer.setFloatValues(from, from + displacement);
        outer.setDuration(duration);
        outer.start();
    }

    void startRebound(float f, float t, long d) {
        rebound.setFloatValues(f, t);
        rebound.setDuration(d);
        rebound.start();
    }

    public SpringAnimator(SpringAnimatorListener listener) {
        inner = new ValueAnimator();
        this.listener = listener;
        inner.setInterpolator(new DecelerateInterpolator(1.5f));
        inner.addUpdateListener(this);
        inner.addListener(this);
        outer = new ValueAnimator();
        outer.setInterpolator(new DecelerateInterpolator(1.5f));
        outer.addUpdateListener(this);
        outer.addListener(this);
        rebound = new ValueAnimator();
        rebound.setInterpolator(new DecelerateInterpolator(1.5f));
        rebound.addUpdateListener(this);
        rebound.addListener(this);
    }

    @Override
    public void onAnimationUpdate(ValueAnimator animator) {
        if (animator == inner) {
            float v = initialVelocity;
            float displacement = 0;
            long currentTime = animator.getCurrentPlayTime();
            do {
                displacement += v;
                v *= dampingCoefficient;
                currentTime--;
            } while (currentTime > 0);
            if (!canceling) listener.onUpdate(this, from + displacement);
        } else {
            if (!canceling) listener.onUpdate(this, (float) animator.getAnimatedValue());
        }
    }

    @Override
    public void onAnimationStart(Animator animation) {
        animating = true;
    }

    @Override
    public void onAnimationEnd(Animator animation) {
        animating = false;
        if (animation == inner) {
            if (!canceling) listener.onInnerEnd(this, this.innerStopVelocity);
        } else if (animation == outer) {
            if (!canceling) listener.onOuterEnd(this);
        } else if (animation == rebound) {
            if (!canceling) listener.onReboundEnd(this);
        }
    }

    @Override
    public void onAnimationCancel(Animator animation) {
        animating = false;
    }

    @Override
    public void onAnimationRepeat(Animator animation) {
    }

    public void start() {
//        animator.end();     //适配安卓API 25及以下
        inner.start();
    }

    public boolean cancel() {
        boolean cancel = this.animating;
        canceling = true;
        if (inner.isRunning()) {
            inner.cancel();
//            inner.end();
        }
        if (outer.isRunning()) {
            outer.cancel();
//            outer.end();
        }
        if (rebound.isRunning()) {
            rebound.cancel();
//            rebound.end();
        }
        canceling = false;
        return cancel;
    }
}

//interface DecelerateListener {
//    void onDecelerateUpdate(DecelerateAnimation animation, float value);
//
//    void onDecelerateEnd(DecelerateAnimation animation);
//}


//class DecelerateAnimation {
//    protected ValueAnimator animator;
//    public boolean animating;
//    private DecelerateListener listener;
//    private DecelerateListener extraListener;
//    private boolean shouldCompete;
//
//    public DecelerateAnimation(final DecelerateListener listener) {
//        animator = new ValueAnimator();
//        this.listener = listener;
//        animator.setInterpolator(new DecelerateInterpolator(1.5f));
//        animator.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
//            @Override
//            public void onAnimationUpdate(ValueAnimator animator) {
//                listener.onDecelerateUpdate(DecelerateAnimation.this,
//                        (float) animator.getAnimatedValue());
//                if (DecelerateAnimation.this.extraListener != null)
//                    DecelerateAnimation.this.extraListener.onDecelerateUpdate(
//                            DecelerateAnimation.this, (float) animator.getAnimatedValue());
//
//            }
//        });
//        animator.addListener(new Animator.AnimatorListener() {
//            @Override
//            public void onAnimationStart(Animator animation) {
//                DecelerateAnimation.this.animating = true;
//            }
//
//            @Override
//            public void onAnimationEnd(Animator animation) {
//                DecelerateAnimation.this.animating = false;
//                if (DecelerateAnimation.this.extraListener != null)
//                    DecelerateAnimation.this.extraListener.onDecelerateEnd(
//                            DecelerateAnimation.this);
//                if (DecelerateAnimation.this.shouldCompete)
//                    DecelerateAnimation.this.listener.onDecelerateEnd(DecelerateAnimation.this);
//            }
//
//            @Override
//            public void onAnimationCancel(Animator animation) {
//                DecelerateAnimation.this.animating = false;
//            }
//
//            @Override
//            public void onAnimationRepeat(Animator animation) {
//            }
//        });
//    }
//
//    public void config(float from, float to, long duration) {
//        config(from, to, duration, true);
//    }
//
//    public void config(float from, float to, long duration, boolean shouldCompete) {
//        animator.setFloatValues(from, to);
//        animator.setDuration(duration);
//        this.shouldCompete = shouldCompete;
//    }
//
//    public void configFromSpeed(float base, float v, float dampingCoefficient, boolean shouldCompete) {
//        int duration = 0;
//        float displacement = 0;
//        while (Math.abs(v) > 0.001f) {
//            displacement += v;
//            v *= dampingCoefficient;
//            duration++;
//        }
//        config(base, base - displacement, duration, shouldCompete);
//    }
//
//    public void setExtraListener(DecelerateListener listener) {
//        this.extraListener = listener;
//    }
//
//    public void start() {
//
//        animator.start();
//    }
//
//    public boolean cancel() {
//        boolean cancel = this.animating;
//        animator.cancel();
////        animator.end(); //适配安卓API 25及以下
//        return cancel;
//    }
//
//}
