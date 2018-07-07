/*
 *
 * Created by Stone
 * https://github.com/bolan9999
 * Email: shanshang130@gmail.com
 * Date: 2018/7/5
 *
 */

import React from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Platform,
  PixelRatio
} from "react-native";
import { PanGestureHandler as Pan, State } from "react-native-gesture-handler";

export class SpringScrollView extends React.Component {
  _panHandler;
  _panOffsetY: Animated.Value;
  _animatedOffsetY: Animated.Value;
  _endAnimate;
  _endAnimateVelocity: number = 0;
  _endAnimateStartTime: number;
  _beyondAnimate;
  _contentOffsetY: Animated.Value;
  _touching: boolean = false;

  _contentOffset: { x: number, y: number } = {};
  _panOffset: { x: number, y: number } = {};
  _animatedOffset: { x: number, y: number } = {};
  _panOffsetYOffset: number = 0;
  _testOffset: number;

  _contentLayout;
  _wrapperLayout;
  _layoutConfirmed: boolean = false;
  _contentView;

  constructor(props) {
    super(props);
    this._panOffsetY = new Animated.Value(0);
    this._animatedOffsetY = new Animated.Value(0);
    this._panHandler = Animated.event(
      [
        {
          nativeEvent: {
            // translationX: this._panOffsetX,
            translationY: this._panOffsetY
          }
        }
      ],
      { useNativeDriver: true }
    );
    this._contentOffsetY = Animated.add(
      this._panOffsetY,
      this._animatedOffsetY
    );
    this._animatedOffsetY.addListener(v => {
      this._animatedOffset.y = v.value;
      if (this._endAnimate) {
        if (this._panOffsetYOffset + this._animatedOffset.y > 0) {
          const animatedTime = new Date().getTime() - this._endAnimateStartTime;
          const velocity =
            this._endAnimateVelocity * Math.pow(0.997, animatedTime);
          this._endAnimate.stop();
          this._beyondAnimate = Animated.sequence([
            Animated.decay(this._animatedOffsetY, {
              velocity: velocity,
              deceleration: 0.9,
              useNativeDriver: true
            }),
            Animated.timing(this._animatedOffsetY, {
              toValue: -this._panOffsetYOffset,
              duration: 300,
              easing: Easing.cos,
              useNativeDriver: true
            })
          ]);
          this._beyondAnimate.start();
        } else if (
          this._panOffsetYOffset + this._animatedOffset.y <
          -this._contentLayout.height + this._wrapperLayout.height
        ) {
          const animatedTime = new Date().getTime() - this._endAnimateStartTime;
          const velocity =
            this._endAnimateVelocity * Math.pow(0.997, animatedTime);
          this._endAnimate.stop();
          this._beyondAnimate = Animated.sequence([
            Animated.decay(this._animatedOffsetY, {
              velocity: velocity,
              deceleration: 0.9,
              useNativeDriver: true
            }),
            Animated.timing(this._animatedOffsetY, {
              toValue:
                -this._contentLayout.height +
                this._wrapperLayout.height -
                this._panOffsetYOffset,
              duration: 300,
              easing: Easing.cos,
              useNativeDriver: true
            })
          ]);
          this._beyondAnimate.start();
        }
      }
    });
  }
  render() {
    const { contentStyle, style } = this.props;
    let contentOffsetY;
    if (this._layoutConfirmed) {
      contentOffsetY = this._contentOffsetY.interpolate({
        inputRange: [
          Number.MIN_SAFE_INTEGER,
          -this._contentLayout.height + this._wrapperLayout.height,
          0,
          Number.MAX_SAFE_INTEGER
        ],
        outputRange: [
          Number.MIN_SAFE_INTEGER * 0.5,
          -this._contentLayout.height + this._wrapperLayout.height,
          0,
          Number.MAX_SAFE_INTEGER * 0.5
        ]
      });
    } else {
      contentOffsetY = this._contentOffsetY.interpolate({
        inputRange: [Number.MIN_SAFE_INTEGER, 0, Number.MAX_SAFE_INTEGER],
        outputRange: [Number.MIN_SAFE_INTEGER, 0, Number.MAX_SAFE_INTEGER * 0.5]
      });
    }
    const cStyle = StyleSheet.flatten([
      contentStyle,
      {
        transform: [{ translateY: contentOffsetY }]
      }
    ]);
    return (
      <Pan
        minDist={0}
        onGestureEvent={this._panHandler}
        onHandlerStateChange={this._onHandlerStateChange}
      >
        <Animated.View {...this.props} onLayout={this._onWrapperLayout}>
          <Animated.View
            style={cStyle}
            onLayout={this._onLayout}
            ref={ref => (this._contentView = ref)}
          >
            {this.props.children}
          </Animated.View>
        </Animated.View>
      </Pan>
    );
  }

  _onHandlerStateChange = ({ nativeEvent: event }) => {
    // console.log("event.translationY", event.translationY);
    switch (event.state) {
      case State.BEGAN:
        this._endAnimate && this._endAnimate.stop();
        this._endAnimate = null;
        this._beyondAnimate && this._beyondAnimate.stop();
        this._beyondAnimate = null;
        this._touching = true;
        break;
      case State.CANCELLED:
      case State.FAILED:
      case State.END:
        this._panOffsetYOffset += event.translationY;
        this._panOffsetY.extractOffset();
        this._endAnimateVelocity = event.velocityY / 1000;
        this._endAnimate = Animated.decay(this._animatedOffsetY, {
          velocity: this._endAnimateVelocity,
          deceleration: 0.997,
          useNativeDriver: true
        });
        this._endAnimateStartTime = new Date().getTime();
        this._endAnimate.start(() => {
          this._endAnimateStartTime = 0;
          this._endAnimate = null;
          this._endAnimateVelocity = 0;
        });
        this._touching = false;
    }
  };

  _onLayout = ({ nativeEvent: { layout: layout } }) => {
    this._contentLayout = layout;
    this._onLayoutConfirm();
  };
  _onWrapperLayout = ({ nativeEvent: { layout: layout } }) => {
    this._wrapperLayout = layout;
    this._onLayoutConfirm();
  };

  _onLayoutConfirm() {
    if (
      !this._layoutConfirmed &&
      this._contentLayout &&
      this._wrapperLayout
    ) {
      this._layoutConfirmed = true;
      this.forceUpdate();
    }
  }
}
