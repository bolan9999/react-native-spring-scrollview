/*
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2021-09-24 09:47:22
 * @LastEditTime: 2021-10-12 17:54:17
 * @LastEditors: 石破天惊
 * @Description:
 */

import React from "react";
import { Platform, StyleSheet, ViewProps } from "react-native";
import {
  NativeViewGestureHandler,
  PanGestureHandler,
  TapGestureHandler,
  createNativeWrapper,
} from "react-native-gesture-handler";
import Reanimated, {
  cancelAnimation,
  Easing,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withDelay,
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
  const vIndicatorOpacity = useSharedValue(0);
  const hIndicatorOpacity = useSharedValue(0);

  const vBounces = props.bounces === true || props.bounces === "vertical";
  const hBounces = props.bounces === true || props.bounces === "horizontal";

  if (!props.showsHorizontalScrollIndicator) hIndicatorOpacity.value = 0;
  if (!props.showsVerticalScrollIndicator) vIndicatorOpacity.value = 0;

  directionalLockEnabled.value = props.directionalLockEnabled;
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
    if (props.bounces === false || props.bounces === "vertical") {
      const estX = contentOffset.x.value + offset.x;
      if (estX < -contentInsets.left.value) {
        offset.x = -contentInsets.left.value - contentOffset.x.value;
      } else if (
        estX >
        contentSize.width.value - size.width.value + contentInsets.right.value
      ) {
        offset.x =
          contentSize.width.value -
          size.width.value +
          contentInsets.right.value -
          contentOffset.x.value;
      }
    }
    if (props.bounces === false || props.bounces === "horizontal") {
      const estY = contentOffset.y.value + offset.y;
      if (estY < -contentInsets.top.value) {
        offset.y = -contentInsets.top.value - contentOffset.y.value;
      } else if (
        estY >
        contentSize.height.value -
          size.height.value +
          contentInsets.bottom.value
      ) {
        offset.y =
          contentSize.height.value -
          size.height.value +
          contentInsets.bottom.value -
          contentOffset.y.value;
      }
    }
    if (directionalLockEnabled.value) {
      if (!draggingDirection.value) {
        draggingDirection.value =
          Math.abs(offset.x) > Math.abs(offset.y) ? "h" : "v";
      }
      if (draggingDirection.value === "h") offset.y = 0;
      if (draggingDirection.value === "v") offset.x = 0;
    }
    if ((offset.x < 0 && isOutOfLeft()) || (offset.x > 0 && isOutOfRight())) {
      offset.x = offset.x * (-0.001 * Math.abs(offset.x) + 0.5);
    }
    if ((offset.y < 0 && isOutOfTop()) || (offset.y > 0 && isOutOfBottom())) {
      offset.y = offset.y * (-0.001 * Math.abs(offset.y) + 0.5);
    }
    contentOffset.x.value += offset.x;
    contentOffset.y.value += offset.y;
  };

  const panHandler = useAnimatedGestureHandler({
    onStart: (evt, ctx) => (ctx.last = { x: evt.absoluteX, y: evt.absoluteY }),
    onActive: (evt, ctx) => {
      if (!props.scrollEnabled) return;
      if (
        props.showsVerticalScrollIndicator &&
        size.height.value <
          contentSize.height.value +
            contentInsets.top.value +
            contentInsets.bottom.value
      )
        vIndicatorOpacity.value = 1;
      if (
        props.showsHorizontalScrollIndicator &&
        size.width.value <
          contentSize.width.value +
            contentInsets.left.value +
            contentInsets.right.value
      )
        hIndicatorOpacity.value = 1;
      const factor = props.inverted ? -1 : 1;
      drag({
        x: ctx.last.x - evt.absoluteX,
        y: factor * (ctx.last.y - evt.absoluteY),
      });
      ctx.last = { x: evt.absoluteX, y: evt.absoluteY };
    },
    onEnd: (evt) => {
      if (!props.scrollEnabled) return;
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

      if (hBounces && isOutOfHorizontal()) {
        contentOffset.x.value = withSpring(
          isOutOfLeft() ? -contentInsets.left.value : maxX,
          {
            velocity: vx,
            damping: 30,
            mass: 1,
            stiffness: 225,
          },
          (isFinish) => {
            if (isFinish)
              hIndicatorOpacity.value = withDelay(1000, withTiming(0));
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
            if (!isFinish) return;
            if (hBounces) {
              contentOffset.x.value = withSpring(
                contentOffset.x.value + 0.01,
                {
                  velocity: vx,
                  damping: 48,
                  mass: 2.56,
                  stiffness: 225,
                },
                (isFinish) => {
                  if (isFinish)
                    hIndicatorOpacity.value = withDelay(1000, withTiming(0));
                }
              );
            } else {
              hIndicatorOpacity.value = withDelay(1000, withTiming(0));
            }
          }
        );
      }
      if (vBounces && isOutOfVertical()) {
        contentOffset.y.value = withSpring(
          isOutOfTop() ? -contentInsets.top.value : maxY,
          {
            velocity: vy,
            damping: 30,
            mass: 1,
            stiffness: 225,
          },
          (isFinish) => {
            if (isFinish)
              vIndicatorOpacity.value = withDelay(1000, withTiming(0));
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
            if (!isFinish) return;
            if (vBounces) {
              contentOffset.y.value = withSpring(
                contentOffset.y.value + 0.01,
                {
                  velocity: vy,
                  damping: 48,
                  mass: 2.56,
                  stiffness: 225,
                },
                (isFinish) => {
                  if (isFinish)
                    vIndicatorOpacity.value = withDelay(1000, withTiming(0));
                }
              );
            } else {
              vIndicatorOpacity.value = withDelay(1000, withTiming(0));
            }
          }
        );
      }
    },
  });
  const touchHandler = {
    onTouchStart: () => {
      // console.log("onTouchStart");
      draggingDirection.value = "";
      cancelAnimation(contentOffset.x);
      cancelAnimation(contentOffset.y);
      cancelAnimation(vIndicatorOpacity);
      cancelAnimation(hIndicatorOpacity);
    },
    onTouchEnd: () => {
      // console.log("onTouchEnd");
      vIndicatorOpacity.value = withDelay(2000, withTiming(0));
      hIndicatorOpacity.value = withDelay(2000, withTiming(0));
    },
    onTouchCancel: () => {
      // console.log("onTouchCancel");
    },
  };
  const containerStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      overflow: Platform.OS === "ios" ? "scroll" : "hidden",
      transform: [{ scaleY: props.inverted ? -1 : 1 }],
    };
  });
  const contentContainerStyle = useAnimatedStyle(() => {
    return {
      flexGrow: 1,
      transform: [
        { translateX: -contentOffset.x.value },
        { translateY: -contentOffset.y.value },
      ],
    };
  });
  const vIndicatorStyle = useAnimatedStyle(() => {
    return {
      opacity: vIndicatorOpacity.value,
      height: contentSize.height.value
        ? (size.height.value * size.height.value) / contentSize.height.value - 6
        : contentSize.height.value,
      transform: [
        {
          translateY: contentSize.height.value
            ? (contentOffset.y.value * size.height.value) /
              contentSize.height.value
            : 0,
        },
      ],
    };
  });
  const hIndicatorStyle = useAnimatedStyle(() => {
    return {
      opacity: hIndicatorOpacity.value,
      width: contentSize.width.value
        ? (size.width.value * size.width.value) / contentSize.width.value - 6
        : contentSize.width.value,
      transform: [
        {
          translateX: contentSize.width.value
            ? (contentOffset.x.value * size.width.value) /
              contentSize.width.value
            : 0,
        },
      ],
    };
  });
  return (
    <PanGestureHandler onGestureEvent={panHandler}>
      <Reanimated.View
        {...props}
        style={[containerStyle, props.style]}
        onLayout={onSize}
        {...touchHandler}
      >
        <Reanimated.View
          onLayout={onContentSize}
          style={[contentContainerStyle, props.contentContainerStyle]}
        >
          {props.children}
        </Reanimated.View>
        <Reanimated.View style={[styles.hIndicator, hIndicatorStyle]} />
        <Reanimated.View style={[styles.vIndicator, vIndicatorStyle]} />
      </Reanimated.View>
    </PanGestureHandler>
  );
}

SpringScrollView.defaultProps = {
  inverted: false,
  bounces: true,
  scrollEnabled: true,
  directionalLockEnabled: true,
  showsVerticalScrollIndicator: true,
  showsHorizontalScrollIndicator: true,
  dragToHideKeyboard: true,
  pagingEnabled: false,
  decelerationRate: 0.998,
  pageSize: { width: 0, height: 0 },
};
