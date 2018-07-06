/*
 *
 * Created by Stone
 * https://github.com/bolan9999
 * Email: shanshang130@gmail.com
 * Date: 2018/7/5
 *
 */

import React from "react";
import { Animated, Easing, StyleSheet, Platform } from "react-native";
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

  _contentOffset: { x: number, y: number } = {};
  _panOffset: { x: number, y: number } = {};
  _animatedOffset: { x: number, y: number } = {};

  constructor(props) {
    super(props);
    this._panOffsetY = new Animated.Value(0);
    this._animatedOffsetY = new Animated.Value(0);
    // this._panOffsetY.addListener(value=>this._contentOffset.y=value);

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
    ).interpolate({
      inputRange: [Number.MIN_SAFE_INTEGER, 0, Number.MAX_SAFE_INTEGER],
      outputRange: [Number.MIN_SAFE_INTEGER, 0, Number.MAX_SAFE_INTEGER * 0.5]
    });
    this._panOffsetY.addListener(v => {
      this._panOffset.y = v.value;
    });
    this._animatedOffsetY.addListener(v => {
      this._animatedOffset.y = v.value;
      if (this._panOffset.y + this._animatedOffset.y > 0 && this._endAnimate) {
        const animatedTime = new Date().getTime() - this._endAnimateStartTime;
        const velocity =
          this._endAnimateVelocity * Math.pow(0.997, animatedTime);
        this._endAnimate.stop();
        this._endAnimate = null;
        this._beyondAnimate = Animated.sequence([
          Animated.decay(this._animatedOffsetY, {
            velocity: velocity,
            deceleration: 0.9,
            useNativeDriver: true
          }),
          Animated.timing(this._animatedOffsetY, {
            toValue: -this._panOffset.y,
            duration: 300,
            easing: Easing.sin,
            useNativeDriver: true
          })
        ]);
        this._beyondAnimate.start();
      }
    });
  }
  render() {
    const { contentStyle, style } = this.props;
    const cStyle = StyleSheet.flatten([
      contentStyle,
      {
        transform: [{ translateY: this._contentOffsetY }]
      }
    ]);
    return (
      <Pan
        minDist={Platform.OS === "ios" ? 0 : 10}
        onGestureEvent={this._panHandler}
        onHandlerStateChange={this._onHandlerStateChange}
      >
        <Animated.View {...this.props}>
          <Animated.View style={cStyle}>
            {this.props.children}
          </Animated.View>
        </Animated.View>
      </Pan>
    );
  }

  _onHandlerStateChange = ({ nativeEvent: event }) => {
    // console.log("event.state", event.state);
    switch (event.state) {
      case State.BEGAN:
        this._endAnimate && this._endAnimate.stop();
        this._endAnimate = null;
        break;
      case State.CANCELLED:
      case State.FAILED:
      case State.END:
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
          // this._panOffsetY.flattenOffset();
          // if (this._animatedOffset.y+this._panOffset.y>0){
          //   // Animated.timing(this._contentOffsetY,{toValue:0, duration:500}).start(()=>{
          //   console.log("===================");
          //
          //     this._panOffsetY.setValue(0);
          //     this._animatedOffsetY.setValue(0);
          //   // })
          // }
        });
    }
  };
}
