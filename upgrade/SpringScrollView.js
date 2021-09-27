/*
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2021-09-24 09:47:22
 * @LastEditTime: 2021-09-27 16:13:03
 * @LastEditors: 石破天惊
 * @Description:
 */

import React from "react";
import { StyleSheet, ViewProps } from "react-native";
import {
  PanGestureHandler,
  TapGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { styles } from "./styles";

export function SpringScrollView(props) {
  const size = { width: useSharedValue(0), height: useSharedValue(0) };
  const contentSize = { width: useSharedValue(0), height: useSharedValue(0) };
  const contentOffset = { x: useSharedValue(0), y: useSharedValue(0) };
  const contentInsets = {
    top: useSharedValue(0),
    bottom: useSharedValue(0),
    left: useSharedValue(0),
    right: useSharedValue(0),
  };
  const refreshHeaderHeight = useSharedValue(80);
  const loadingFooterHeight = useSharedValue(80);
  const directionalLockEnabled = useSharedValue(true);
  const draggingDirection = useSharedValue("");

  const onSize = (e) => {
    size.width.value = e.nativeEvent.layout.width;
    size.height.value = e.nativeEvent.layout.height;
  };
  const onContentSize = (e) => {
    contentSize.width.value = e.nativeEvent.layout.width;
    contentSize.height.value = e.nativeEvent.layout.height;
  };

  const isOutOfTop = () => {
    "worklet";
    return contentOffset.y.value < -contentInsets.top.value;
  };
  const isEnoughToRefresh = () => {
    "worklet";
    return (
      contentOffset.y.value <
      -contentInsets.top.value - refreshHeaderHeight.value
    );
  };
  const isOutOfBottom = () => {
    "worklet";
    return contentOffset.y.value > contentSize.height.value - size.height.value;
  };
  const isEnoughToLoadMore = () => {
    "worklet";
    return (
      contentOffset.y.value >
      -size.height.value + contentSize.height.value + loadingFooterHeight.value
    );
  };
  const isOutOfLeft = () => {
    "worklet";
    return contentOffset.x.value < -contentInsets.left.value;
  };
  const isOutOfRight = () => {
    "worklet";
    return (
      contentOffset.x.value >
      contentInsets.right.value + contentSize.width.value - size.width.value
    );
  };
  const isOutOfHorizontal = () => {
    "worklet";
    return isOutOfLeft() || isOutOfRight();
  };
  const isOutOfVertical = () => {
    "worklet";
    return isOutOfTop() || isOutOfBottom();
  };

  const drag = (offset) => {
    "worklet";
    if (directionalLockEnabled.value) {
      if (!draggingDirection.value) {
        draggingDirection.value =
          Math.abs(offset.x) > Math.abs(offset.y) ? "h" : "v";
      }
      if (draggingDirection.value === "h") offset.y = 0;
      if (draggingDirection.value === "v") offset.x = 0;
    }
    if (isOutOfHorizontal()) {
      offset.x = offset.x * (-0.001 * Math.abs(offset.x) + 0.5);
    }
    if (isOutOfVertical()) {
      offset.y = offset.y * (-0.001 * Math.abs(offset.y) + 0.5);
    }
    contentOffset.x.value += offset.x;
    contentOffset.y.value += offset.y;
  };

  const panHandler = useAnimatedGestureHandler({
    onStart: (evt, ctx) => (ctx.last = { x: evt.absoluteX, y: evt.absoluteY }),
    onActive: (evt, ctx) => {
      const factor = props.inverted ? -1 : 1;
      drag({
        x: factor * (ctx.last.x - evt.absoluteX),
        y: factor * (ctx.last.y - evt.absoluteY),
      });
      ctx.last = { x: evt.absoluteX, y: evt.absoluteY };
    },
    onEnd: (evt) => {
      const maxX =
        contentSize.width.value - size.width.value + contentInsets.right.value;
      const maxY =
        contentSize.height.value +
        contentInsets.bottom.value -
        size.height.value;
      const vx = draggingDirection.value === "v" ? 0 : -evt.velocityX;
      const vy =
        evt.velocityY *
        (props.inverted ? 1 : -1) *
        (draggingDirection.value === "h" ? 0 : 1);

      if (isOutOfHorizontal()) {
        contentOffset.x.value = withSpring(
          isOutOfLeft() ? -contentInsets.left.value : maxX,
          {
            velocity: vx,
            damping: 30,
            mass: 1,
            stiffness: 225,
          }
        );
      } else {
        contentOffset.x.value = withDecay(
          {
            velocity: vx,
            deceleration: props.decelerationRate,
            clamp: [0, maxX],
          },
          (isFinish) => {
            if (isFinish) {
              contentOffset.x.value = withSpring(contentOffset.x.value + 0.01, {
                velocity: vx,
                damping: 48,
                mass: 2.56,
                stiffness: 225,
              });
            }
          }
        );
      }

      if (isOutOfVertical()) {
        contentOffset.y.value = withSpring(
          isOutOfTop() ? -contentInsets.top.value : maxY,
          {
            velocity: vy,
            damping: 30,
            mass: 1,
            stiffness: 225,
          }
        );
      } else {
        contentOffset.y.value = withDecay(
          {
            velocity: vy,
            deceleration: props.decelerationRate,
            clamp: [0, maxY],
          },
          (isFinish) => {
            if (isFinish) {
              contentOffset.y.value = withSpring(contentOffset.y.value + 0.01, {
                velocity: vy,
                damping: 48,
                mass: 2.56,
                stiffness: 225,
              });
            }
          }
        );
      }
    },
  });
  const tapHandler = useAnimatedGestureHandler({
    onStart: () => {
      draggingDirection.value = "";
      cancelAnimation(contentOffset.x);
      cancelAnimation(contentOffset.y);
    },
  });
  const containerStyle = useAnimatedStyle(() => {
    return {
      overflow: "scroll",
      transform: [{ scaleY: props.inverted ? -1 : 1 }],
    };
  });
  const contentContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: -contentOffset.x.value },
        { translateY: -contentOffset.y.value },
      ],
    };
  });
  return (
    <PanGestureHandler
      onGestureEvent={panHandler}
      shouldCancelWhenOutside={false}
    >
      <Animated.View
        {...props}
        style={[containerStyle, props.style]}
        onLayout={onSize}
      >
        <TapGestureHandler onGestureEvent={tapHandler}>
          <Animated.View style={styles.fill}>
            <Animated.View
              onLayout={onContentSize}
              style={[contentContainerStyle, props.contentContainerStyle]}
            >
              {props.children}
            </Animated.View>
          </Animated.View>
        </TapGestureHandler>
      </Animated.View>
    </PanGestureHandler>
  );
}

SpringScrollView.defaultProps = {
  decelerationRate: 0.998,
};
