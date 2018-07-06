/**
 * Author: Shi(bolan0000@icloud.com)
 * Date: 2018/7/4
 * Copyright (c) 2018, AoTang, Inc.
 *
 * Description:
 */

import * as React from "react";
import { StyleSheet, View, Animated, Text, Easing, ScrollView } from "react-native";
import {
  NativeViewGestureHandler as Gesture,
  PanGestureHandler as Pan,
  State
} from "react-native-gesture-handler";
import { horizontalWarning, verticalWarning } from "./Strings";
import { atLeastCheck } from "./Check";

export class SpringScrollView extends React.Component<PropType, StateType> {
  _scrollRef: Gesture = React.createRef();
  _scrollViewRef:ScrollView;
  _panRef: Pan = React.createRef();
  _transformY: Animated.Value;
  _offsetY: Animated.Value;
  _panHandler;
  _dampingCoefficient: Animated.Value;
  _scrollHandler;
  _scrollEnabled=true;
  _transformYValue:number=0;
  _offsetYValue:number=0;
  _slowDownAnimation;

  constructor(props: PropType) {
    super(props);
    this._transformY = new Animated.Value(0);
    this._dampingCoefficient = new Animated.Value(0);
    this._offsetY = new Animated.Value(0);
    this.state = {
      beyond: this._offsetY.interpolate({
        inputRange: [0, 1, 99999999],
        outputRange: [1, 0, 0]
      })
    };
    this._panHandler = Animated.event(
      [{ nativeEvent: { translationY: this._transformY } }],
      { useNativeDriver: true }
    );
    this._scrollHandler = Animated.event(
      [{ nativeEvent: { contentOffset: { y: this._offsetY } } }],
      { useNativeDriver: true }
    );
    this._transformY.addListener(({value:panY})=>{
      this._transformYValue = panY;
      if (panY===0 && !this._scrollEnabled && this._offsetYValue===0){
        this._scrollViewRef.setNativeProps({scrollEnabled:true})
        this._scrollEnabled = true;
      }
      if(this._offsetYValue===0 && this._scrollEnabled && this._transformYValue>0) {
        this._scrollViewRef.setNativeProps({scrollEnabled:false})
        this._scrollEnabled = false;
      }
    });
    this._offsetY.addListener(({value:v})=>{
      this._offsetYValue = v;
    });
    this.componentWillReceiveProps(props);
  }

  static defaultProps = {
    usageCheck: true,
    dampingCoefficient: 0.5,
    decelerationRate: 0.998
  };

  componentWillReceiveProps(nextProps: PropType) {
    const { style, usageCheck, horizontal, dampingCoefficient } = nextProps;
    if (__DEV__ && usageCheck) {
      const checkStyle = StyleSheet.flatten(style);
      if (
        horizontal &&
        !atLeastCheck(checkStyle, ["width", "minWidth", "flex", "flexGrow"])
      ) {
        console.warn(horizontalWarning);
      }
      if (
        !horizontal &&
        !atLeastCheck(checkStyle, ["height", "minHeight", "flex", "flexGrow"])
      ) {
        console.warn(verticalWarning);
      }
    }
    this._dampingCoefficient.setValue(dampingCoefficient);
  }

  render() {
    const style = StyleSheet.flatten([
      styles.container,
      {
        backgroundColor: "red",
        transform: [
          {
            translateY: Animated.multiply(
              Animated.multiply(this.state.beyond, this._transformY),
              this._dampingCoefficient
            )
          }
        ]
      }
    ]);
    return (
      <Gesture ref={this._scrollRef} simultaneousHandlers={this._panRef}>
        <Animated.ScrollView
          {...this.props}
          ref={ref=>this._scrollViewRef=ref}
          bounces={false}
          overScrollMode={"never"}
          scrollEventThrottle={1}
          onScroll={this._scrollHandler}
        >
          <Pan
            ref={this._panRef}
            minDist={1}
            simultaneousHandlers={this._scrollRef}
            onGestureEvent={this._panHandler}
            onHandlerStateChange={this._onHandlerStateChange}
          >
            <Animated.View
              style={styles.container}
              onLayout={e => {
                this.setState({
                  beyond: this._offsetY.interpolate({
                    inputRange: [
                      0,
                      1,
                      e.nativeEvent.layout.height - 1,
                      e.nativeEvent.layout.height,
                      99999999
                    ],
                    outputRange: [1, 0, 1, 1, 1]
                  })
                });
              }}
            >
              <Animated.View style={style}>
                {this.props.children}
              </Animated.View>
            </Animated.View>
          </Pan>
        </Animated.ScrollView>
      </Gesture>
    );
  }

  _onHandlerStateChange = ({ nativeEvent: event }) => {
    // console.log("event", event);
    switch (event.state) {
      case State.BEGAN:
        this._slowDownAnimation && this._slowDownAnimation.stop();
        this._slowDownAnimation = null;
        this._transformY.extractOffset();
        break;
      case State.CANCELLED:
      case State.FAILED:
      case State.END:
        this._transformY.flattenOffset();
        this._slowDownAnimation = Animated.sequence([
          Animated.decay(this._transformY, {
            velocity: event.velocityY / 1000,
            deceleration: 0.95,
            useNativeDriver: true
          }),
          Animated.timing(this._transformY, {
            toValue: 0,
            duration: 300,
            easing: Easing.sin,
            useNativeDriver: true
          })
        ]);
          this._slowDownAnimation.start();
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

interface PropType {
  usageCheck?: boolean,
  dampingCoefficient?: number,
  decelerationRate?: number
}

interface StateType {
  beyond: Animated.Value
}
