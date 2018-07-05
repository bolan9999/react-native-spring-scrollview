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
  _contentOffsetY: Animated.Value;

  _contentOffset:{x:number,y:number}={};

  constructor(props) {
    super(props);
    this._panOffsetY2 = new Animated.Value(0);
    this._panOffsetY = this._panOffsetY2.interpolate({
      inputRange: [Number.MIN_SAFE_INTEGER, 0, Number.MAX_SAFE_INTEGER],
      outputRange: [Number.MIN_SAFE_INTEGER, 0, 0]
    });
    this._animatedOffsetY2 = new Animated.Value(0);
    this._animatedOffsetY = this._animatedOffsetY2
      .interpolate({
        inputRange: [Number.MIN_SAFE_INTEGER, 0, Number.MAX_SAFE_INTEGER],
        outputRange: [Number.MIN_SAFE_INTEGER, 0, 0]
      });
    // this._panOffsetY.addListener(value=>this._contentOffset.y=value);

    this._panHandler = Animated.event(
      [
        {
          nativeEvent: {
            // translationX: this._panOffsetX,
            translationY: this._panOffsetY2
          }
        }
      ],
      { useNativeDriver: true }
    );
    this._contentOffsetY = Animated.add(
      this._panOffsetY,
      this._animatedOffsetY
    )
      .interpolate({
      inputRange: [Number.MIN_SAFE_INTEGER, 0, Number.MAX_SAFE_INTEGER],
      outputRange: [Number.MIN_SAFE_INTEGER, 0, 0]
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
    console.log("event.state", event.state);
    switch (event.state) {
      case State.BEGAN:
        this._endAnimate && this._endAnimate.stop();
        this._endAnimate = null;
        break;
      case State.CANCELLED:
      case State.FAILED:
      case State.END:
        this._panOffsetY2.extractOffset();
        this._endAnimate = Animated.decay(this._animatedOffsetY2, {
          velocity: event.velocityY / 1000,
          deceleration: 0.997,
          useNativeDriver: true
        });
        this._endAnimate.start();
    }
  };
}
