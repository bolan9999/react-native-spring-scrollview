package com.bolan9999;


import android.animation.Animator;
import android.animation.ValueAnimator;
import android.view.animation.DecelerateInterpolator;

interface DecelerateListener {
    void onDecelerateUpdate(DecelerateAnimation animation, float value);

    void onDecelerateEnd(DecelerateAnimation animation);
}

class DecelerateAnimation {
    protected ValueAnimator animator;
    public boolean animating;
    private DecelerateListener listener;
    private DecelerateListener extraListener;
    private boolean shouldCompete;

    public DecelerateAnimation(final DecelerateListener listener) {
        animator = new ValueAnimator();
        this.listener = listener;
        animator.setInterpolator(new DecelerateInterpolator(1.5f));
        animator.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
            @Override
            public void onAnimationUpdate(ValueAnimator animator) {
                listener.onDecelerateUpdate(DecelerateAnimation.this,
                        (float) animator.getAnimatedValue());
                if (DecelerateAnimation.this.extraListener != null)
                    DecelerateAnimation.this.extraListener.onDecelerateUpdate(
                            DecelerateAnimation.this, (float) animator.getAnimatedValue());

            }
        });
        animator.addListener(new Animator.AnimatorListener() {
            @Override
            public void onAnimationStart(Animator animation) {
                DecelerateAnimation.this.animating = true;
            }

            @Override
            public void onAnimationEnd(Animator animation) {
                DecelerateAnimation.this.animating = false;
                if (DecelerateAnimation.this.extraListener != null)
                    DecelerateAnimation.this.extraListener.onDecelerateEnd(
                            DecelerateAnimation.this);
                if (DecelerateAnimation.this.shouldCompete)
                    DecelerateAnimation.this.listener.onDecelerateEnd(DecelerateAnimation.this);
            }

            @Override
            public void onAnimationCancel(Animator animation) {
                DecelerateAnimation.this.animating = false;
            }

            @Override
            public void onAnimationRepeat(Animator animation) {
            }
        });
    }

    public void config(float from, float to, long duration) {
        config(from, to, duration, true);
    }

    public void config(float from, float to, long duration, boolean shouldCompete) {
        animator.setFloatValues(from, to);
        animator.setDuration(duration);
        this.shouldCompete = shouldCompete;
    }

    public void configFromSpeed(float base, float v, float dampingCoefficient, boolean shouldCompete) {
        int duration = 0;
        float displacement = 0;
        while (Math.abs(v) > 0.001f) {
            displacement += v;
            v *= dampingCoefficient;
            duration++;
        }
        config(base, base - displacement, duration, shouldCompete);
    }

    public void setExtraListener(DecelerateListener listener) {
        this.extraListener = listener;
    }

    public void start() {
        animator.start();
    }

    public boolean cancel() {
        boolean cancel = this.animating;
        animator.cancel();
        return cancel;
    }

}
