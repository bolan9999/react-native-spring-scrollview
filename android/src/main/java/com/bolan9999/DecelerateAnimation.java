package com.bolan9999;


import android.animation.Animator;
import android.animation.ValueAnimator;
import android.view.animation.DecelerateInterpolator;

abstract class DecelerateAnimation {
    protected ValueAnimator animator;
    public boolean animating;

    public DecelerateAnimation(float base, float v, float dampingCoefficient) {
        int duration = 0;
        float displacement = 0;
        while (Math.abs(v) > 0.1f) {
            displacement += v;
            v *= dampingCoefficient;
            duration++;
        }
        animator = ValueAnimator.ofFloat(base, base - displacement);
        animator.setDuration(duration);
    }

    public DecelerateAnimation(float from, float to, long duration) {
        animator = ValueAnimator.ofFloat(from, to);
        animator.setDuration(duration);
    }

    public void start() {
        animator.setInterpolator(new DecelerateInterpolator(1.5f));
        animator.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
            @Override
            public void onAnimationUpdate(ValueAnimator animator) {
                onUpdate((float) animator.getAnimatedValue());
            }
        });
        this.animating = true;
        animator.addListener(new Animator.AnimatorListener() {
            @Override
            public void onAnimationStart(Animator animation) {
            }

            @Override
            public void onAnimationEnd(Animator animation) {
                DecelerateAnimation.this.animating = false;
                onEnd();
            }

            @Override
            public void onAnimationCancel(Animator animation) {
            }

            @Override
            public void onAnimationRepeat(Animator animation) {
            }
        });
        animator.start();
    }

    public boolean cancel() {
        boolean cancel = this.animating;
        animator.cancel();
        return cancel;
    }

    protected void onEnd() {
    }

    protected abstract void onUpdate(float value);
}
