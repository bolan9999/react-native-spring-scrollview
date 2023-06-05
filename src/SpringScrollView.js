/*
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2021-09-24 09:47:22
 * @LastEditTime: 2023-06-02 18:40:04
 * @LastEditors: 陆锡柱
 * @Description:
 */

import React, { useContext, useRef, useState } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  ViewProps,
  ViewStyle,
  TextInput,
  Keyboard,
} from "react-native";
import {
  NativeViewGestureHandler,
  PanGestureHandler,
  TapGestureHandler,
  createNativeWrapper,
} from "react-native-gesture-handler";
import Reanimated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { RefreshHeader } from "./RefreshHeader";
import { LoadingFooter } from "./LoadingFooter";
import { styles } from "./styles";

interface SpringScrollViewType extends ViewProps {
  contentContainerStyle?: ViewStyle;
  inverted?: boolean;
  bounces?: boolean | "vertical" | "horizontal";
  scrollEnabled?: boolean | "vertical" | "horizontal";
  directionalLockEnabled?: boolean;
  showsVerticalScrollIndicator?: boolean;
  showsHorizontalScrollIndicator?: boolean;
  pagingEnabled?: null | undefined | "vertical" | "horizontal";
  decelerationRate?: number;
  pageSize?: { width: number, height: number };
  refreshHeader?: RefreshHeader;
  loadingFooter?: LoadingFooter;
  refreshing?: boolean;
  allLoaded?: boolean;
  loadingMore?: boolean;
  preventReRender?: boolean;
  onScroll?: (contentOffset: {
    x: number,
    y: number,
  }) => any;
  onScrollUI?: (contentOffset: {
    x: Reanimated.SharedValue,
    y: Reanimated.SharedValue,
  }) => any;
  onSizeChange?: ({ width: number, height: number }) => any;
  onContentSizeChange?: ({ width: number, height: number }) => any;
  onTouchBegin?: () => any;
  onTouchEnd?: () => any;
  onScrollBeginDrag?: () => any;
  onScrollEndDrag?: () => any;
  textInputRefs?: TextInput[];
  inputToolBarHeight?: number;
  dragToHideKeyboard?: boolean;
  tapToHideKeyboard?: boolean;
}

export const PanHandlerContext = React.createContext({
  isParentFocus: () => {
    "worklet";
    return false;
  },
  onStart: () => {
    "worklet";
    return false;
  },
  onActive: () => {
    "worklet";
    return false;
  },
  onEnd: () => {
    "worklet";
    return false;
  },
});

export const CrossHeaderTabContext = React.createContext();

export const SpringScrollView = React.forwardRef((props: SpringScrollViewType, ref) => {
  const [sharedValues] = useState({
    size: { width: useSharedValue(0), height: useSharedValue(0) },
    contentSize: { width: useSharedValue(0), height: useSharedValue(0) },
    contentOffset: { x: useSharedValue(0), y: useSharedValue(0) },
    contentInsets: {
      top: useSharedValue(0),
      bottom: useSharedValue(0),
      left: useSharedValue(0),
      right: useSharedValue(0),
    },
    dragging: useSharedValue(false),
    vIndicatorOpacity: useSharedValue(0),
    hIndicatorOpacity: useSharedValue(0),
    refreshAnimating: useSharedValue(false),
    refreshHeaderRef: useRef(),
    refreshStatus: useSharedValue("waiting"),
    loadMoreAnimating: useSharedValue(false),
    loadMoreFooterRef: useRef(),
    loadMoreStatus: useSharedValue("waiting"),
    panRef: useRef(),
    focus: useSharedValue(false),
    currentPage: useSharedValue(0),
    refreshingInner: useSharedValue(false),
    loadingMoreInner: useSharedValue(false),
    keyboardOffset: useSharedValue(0),
  });
  const crossHeaderContext = React.useContext(CrossHeaderTabContext);
  const combined = { ...sharedValues, ...props };
  if (crossHeaderContext) {
    combined.contentOffset = crossHeaderContext.contentOffset;
  }
  return <SpringScrollViewClass ref={ref} {...combined} />;
});

SpringScrollView.defaultProps = {
  isSpringScrollView: true,
  inverted: false,
  bounces: "vertical",
  scrollEnabled: "vertical",
  directionalLockEnabled: true,
  showsVerticalScrollIndicator: true,
  showsHorizontalScrollIndicator: true,
  dragToHideKeyboard: true,
  pagingEnabled: false,
  decelerationRate: 0.997,
  pageSize: { width: 0, height: 0 },
  refreshHeader: RefreshHeader,
  loadingFooter: LoadingFooter,
  refreshing: false,
  loadingMore: false,
  allLoaded: false,
  pageSize: { width: 0, height: 0 },
  onSizeChange: () => 0,
  onContentSizeChange: () => 0,
  textInputRefs: [],
  inputToolBarHeight: 44,
  tapToHideKeyboard: true,
  dragToHideKeyboard: true,
};

class SpringScrollViewClass extends React.Component<SpringScrollViewType> {
  render() {
    return <this.SpringScrollViewCore {...this.props} />;
  }

  SpringScrollViewCore = (props) => {
    const parentHandlerContext = React.useContext(PanHandlerContext);
    const crossHeaderContext = React.useContext(CrossHeaderTabContext);
    const vBounces = props.bounces === true || props.bounces === "vertical";
    const hBounces = props.bounces === true || props.bounces === "horizontal";
    const vScroll = props.scrollEnabled === true || props.scrollEnabled === "vertical";
    const hScroll = props.scrollEnabled === true || props.scrollEnabled === "horizontal";
    //#region function
    const onSize = (e) => {
      const { layout } = e.nativeEvent;
      props.size.width.value = layout.width;
      props.size.height.value = layout.height;
      props.onSizeChange({ ...layout });
    };
    const onContentSize = (e) => {
      const { layout } = e.nativeEvent;
      props.contentSize.width.value = layout.width;
      props.contentSize.height.value = layout.height;
      props.onContentSizeChange({ ...layout });
    };

    const isOutOfTop = () => {
      "worklet";
      return props.contentOffset.y.value <= -props.contentInsets.top.value + 0.1;
    };
    const isEnoughToRefresh = () => {
      "worklet";
      return (
        props.contentOffset.y.value <=
        -props.contentInsets.top.value - props.refreshHeader.height + 0.1
      );
    };
    const isOutOfBottom = () => {
      "worklet";
      return (
        props.contentOffset.y.value >=
        props.contentSize.height.value - props.size.height.value - 0.1
      );
    };
    const isEnoughToLoadMore = () => {
      "worklet";
      return (
        props.contentOffset.y.value >=
        -props.size.height.value + props.contentSize.height.value + props.loadingFooter.height - 0.1
      );
    };
    const isOutOfLeft = () => {
      "worklet";
      return props.contentOffset.x.value <= -props.contentInsets.left.value + 0.1;
    };
    const isOutOfRight = () => {
      "worklet";
      return (
        props.contentOffset.x.value >=
        props.contentInsets.right.value +
          props.contentSize.width.value -
          props.size.width.value -
          0.1
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

    const changeStateWrapper = (status) => {
      props.refreshHeaderRef.current?.changeToState(status);
    };
    const onLoadingMoreStateChange = (status) =>
      props.loadMoreFooterRef.current?.changeToState(status);

    const loadMoreStateWrapper = (status) => {
      props.loadMoreFooterRef.current?.changeToState(status);
    };
    //#endregion

    const drag = (offset) => {
      "worklet";
      if (!hBounces) {
        const estX = props.contentOffset.x.value + offset.x;
        if (estX < -props.contentInsets.left.value) {
          offset.x = -props.contentInsets.left.value - props.contentOffset.x.value;
        } else if (
          estX >
          props.contentSize.width.value - props.size.width.value + props.contentInsets.right.value
        ) {
          offset.x =
            props.contentSize.width.value -
            props.size.width.value +
            props.contentInsets.right.value -
            props.contentOffset.x.value;
        }
      }
      if (!vBounces) {
        const estY = props.contentOffset.y.value + offset.y;
        if (estY < -props.contentInsets.top.value) {
          offset.y = -props.contentInsets.top.value - props.contentOffset.y.value;
        } else if (
          estY >
          props.contentSize.height.value -
            props.size.height.value +
            props.contentInsets.bottom.value
        ) {
          offset.y =
            props.contentSize.height.value -
            props.size.height.value +
            props.contentInsets.bottom.value -
            props.contentOffset.y.value;
        }
      }
      if (props.dragging.value === "horizontal") offset.y = 0;
      if (props.dragging.value === "vertical") offset.x = 0;
      if ((offset.x < 0 && isOutOfLeft()) || (offset.x > 0 && isOutOfRight())) {
        offset.x = offset.x * (-0.001 * Math.abs(offset.x) + 0.5);
      }
      if ((offset.y < 0 && isOutOfTop()) || (offset.y > 0 && isOutOfBottom())) {
        offset.y = offset.y * (-0.001 * Math.abs(offset.y) + 0.5);
      }
      props.contentOffset.x.value += offset.x;
      props.contentOffset.y.value += offset.y;
      let shouldChange = false;
      if (props.refreshStatus.value === "waiting" && isOutOfTop()) {
        props.refreshStatus.value = "pulling";
        shouldChange = true;
      } else if (
        (props.refreshStatus.value === "pulling" ||
          props.refreshStatus.value === "pullingCancel") &&
        props.contentOffset.y.value < -props.refreshHeader.height
      ) {
        props.refreshStatus.value = "pullingEnough";
        shouldChange = true;
      } else if (
        props.refreshStatus.value === "pullingEnough" &&
        props.contentOffset.y.value > -props.refreshHeader.height
      ) {
        props.refreshStatus.value = "pullingCancel";
        shouldChange = true;
      }
      shouldChange && runOnJS(changeStateWrapper)(props.refreshStatus.value);
      shouldChange = false;
      if (props.loadMoreStatus.value === "waiting" && isOutOfBottom()) {
        props.loadMoreStatus.value = "dragging";
        shouldChange = true;
      } else if (
        (props.loadMoreStatus.value === "dragging" ||
          props.loadMoreStatus.value === "draggingCancel") &&
        props.contentOffset.y.value >
          props.contentSize.height.value - props.size.height.value + props.loadingFooter.height
      ) {
        props.loadMoreStatus.value = "draggingEnough";
        shouldChange = true;
      } else if (
        props.loadMoreStatus.value === "draggingEnough" &&
        props.contentOffset.y.value <
          props.contentSize.height.value - props.size.height.value + props.loadingFooter.height
      ) {
        props.loadMoreStatus.value = "draggingCancel";
        shouldChange = true;
      }
      shouldChange && runOnJS(onLoadingMoreStateChange)(props.loadMoreStatus.value);
    };

    //判断滑动方向是否和锁定方向一致
    const isPanFitFocus = (evt) => {
      "worklet";
      if (props.focus.value === true) return true;
      if (Math.abs(evt.translationX) > Math.abs(evt.translationY)) {
        return props.focus.value === "horizontal";
      } else {
        return props.focus.value === "vertical";
      }
    };
    //判断视图已经碰边，并且仍然向改方向滑动
    const isPanOutOfRange = (evt) => {
      "worklet";
      if (Math.abs(evt.translationX) > Math.abs(evt.translationY)) {
        if (!hBounces) return false;
        if (evt.translationX > 0) return isOutOfLeft();
        else return isOutOfRight();
      } else {
        if (!vBounces) return false;
        if (evt.translationY > 0) return isOutOfTop();
        else return isOutOfBottom();
      }
    };
    //判断手势方向是否是当前滑动的方向
    const isPanFitScroll = (evt) => {
      "worklet";
      if (props.scrollEnabled === true) return true;
      if (Math.abs(evt.translationX) > Math.abs(evt.translationY)) {
        return props.scrollEnabled === "horizontal";
      } else {
        return props.scrollEnabled === "vertical";
      }
    };
    const isParentFocus = () => {
      "worklet";
      return props.focus.value;
    };
    const onStart = (evt, ctx, preventEventBubble) => {
      "worklet";
      if (evt.translationX === 0 && evt.translationY === 0) {
        ctx.started = false;
        return false;
      }
      ctx.started = true;
      if (!preventEventBubble) {
        if (!props.focus.value) {
          if (parentHandlerContext.isParentFocus()) return parentHandlerContext.onStart(evt, ctx);
          if (!isPanFitScroll(evt)) {
            return parentHandlerContext.onStart(evt, ctx);
          }
          if (isPanOutOfRange(evt)) {
            if (parentHandlerContext.onStart(evt, ctx)) return true;
          }
        }
      }
      if (props.scrollEnabled) {
        ctx.last = { x: evt.absoluteX, y: evt.absoluteY };
        if (!props.directionalLockEnabled) {
          props.dragging.value = props.scrollEnabled;
          props.focus.value = props.scrollEnabled;
        } else {
          props.dragging.value =
            Math.abs(evt.translationX) > Math.abs(evt.translationY) ? "horizontal" : "vertical";
          props.focus.value = props.dragging.value;
        }
        props.onScrollBeginDrag && runOnJS(props.onScrollBeginDrag)();
        return true;
      }
      return false;
    };
    let panHandler = props.panHandler;
    if (!panHandler)
      panHandler = {
        isParentFocus,
        onStart,
        onActive: (evt, ctx, preventEventBubble) => {
          "worklet";
          if (!ctx.started && !onStart(evt, ctx, preventEventBubble)) return false;
          if (!props.focus.value)
            return parentHandlerContext.onActive(evt, ctx, preventEventBubble);
          props.dragToHideKeyboard && runOnJS(Keyboard.dismiss)();
          if (
            props.showsVerticalScrollIndicator &&
            props.size.height.value < props.contentSize.height.value
          )
            props.vIndicatorOpacity.value = 1;
          if (
            props.showsHorizontalScrollIndicator &&
            props.size.width.value < props.contentSize.width.value
          )
            props.hIndicatorOpacity.value = 1;
          const factor = props.inverted ? -1 : 1;
          drag({
            x: ctx.last.x - evt.absoluteX,
            y: factor * (ctx.last.y - evt.absoluteY),
          });
          ctx.last = { x: evt.absoluteX, y: evt.absoluteY };
          return true;
        },
        onTouchesCancelled: () => {
          console.log("onTouchesCancelled");
        },
        onEnd: (evt, ctx, preventEventBubble) => {
          "worklet";
          props.dragging.value = false;
          if (!props.focus.value) return parentHandlerContext.onEnd(evt);
          props.onTouchEnd && runOnJS(props.onTouchEnd)();
          if (!props.scrollEnabled) return;
          props.onScrollEndDrag && runOnJS(props.onScrollEndDrag)();
          props.keyboardOffset.value = 0;
          const maxX =
            props.contentSize.width.value -
            props.size.width.value +
            props.contentInsets.right.value;
          let maxY =
            props.contentSize.height.value +
            props.contentInsets.bottom.value -
            props.size.height.value;
          const vx = props.dragging.value === "v" ? 0 : -evt.velocityX;
          const vy =
            evt.velocityY * (props.inverted ? 1 : -1) * (props.dragging.value === "h" ? 0 : 1);
          if (hScroll) {
            if (isOutOfHorizontal()) {
              props.contentOffset.x.value = withSpring(
                isOutOfLeft() ? -props.contentInsets.left.value : maxX,
                {
                  velocity: vx,
                  damping: 30,
                  mass: 1,
                  stiffness: 225,
                  restDisplacementThreshold: 50,
                  restSpeedThreshold: 10,
                },
                (isFinish) => {
                  if (isFinish) {
                    props.focus.value = false;
                    props.hIndicatorOpacity.value = withDelay(1000, withTiming(0));
                  }
                },
              );
            } else {
              if (props.pagingEnabled === "horizontal") {
                const pageWidth =
                  props.pageSize.width === 0 ? props.size.width.value : props.pageSize.width;
                let page = props.currentPage.value;
                if (evt.velocityX < -3) page++;
                else if (evt.velocityX > 3) page--;
                if (page > Math.ceil(props.contentSize.width.value / pageWidth) - 1)
                  page = Math.ceil(props.contentSize.width.value / pageWidth) - 1;
                if (page < 0) page = 0;
                props.currentPage.value = page;
                props.contentOffset.x.value = withSpring(
                  page * pageWidth,
                  {
                    velocity: 50,
                    damping: 30,
                    mass: 1,
                    stiffness: 225,
                    restDisplacementThreshold: 50,
                    restSpeedThreshold: 10,
                  },
                  (isFinish) => {
                    if (isFinish) {
                      props.focus.value = false;
                    }
                  },
                );
              } else {
                props.contentOffset.x.value = withDecay(
                  {
                    velocity: vx,
                    deceleration: props.decelerationRate,
                    clamp: [0, maxX],
                    rubberBandEffect: true,
                  },
                  (isFinish) => {
                    if (!isFinish) return;
                    if (hBounces) {
                      props.contentOffset.x.value = withSpring(
                        props.contentOffset.x.value + 0.01,
                        {
                          velocity: vx,
                          damping: 48,
                          mass: 2.56,
                          stiffness: 225,
                          restDisplacementThreshold: 50,
                          restSpeedThreshold: 10,
                        },
                        (isFinish) => {
                          if (isFinish) {
                            props.focus.value = false;
                            props.hIndicatorOpacity.value = withDelay(1000, withTiming(0));
                          }
                        },
                      );
                    } else {
                      props.focus.value = false;
                      props.hIndicatorOpacity.value = withDelay(1000, withTiming(0));
                    }
                  },
                );
              }
            }
          }
          if (vScroll) {
            if (isOutOfVertical()) {
              if (props.onRefresh && props.refreshStatus.value === "pullingEnough") {
                props.contentInsets.top.value = props.refreshHeader.height;
                props.refreshAnimating.value = true;
                runOnJS(props.onRefresh)();
              }
              if (
                !props.allLoaded &&
                props.onLoadingMore &&
                props.loadMoreStatus.value === "draggingEnough"
              ) {
                props.contentInsets.bottom.value = props.loadingFooter.height;
                props.loadMoreAnimating.value = true;
                maxY += props.loadingFooter.height;
                runOnJS(props.onLoadingMore)();
              }

              props.contentOffset.y.value = withSpring(
                isOutOfTop() ? -props.contentInsets.top.value : maxY,
                {
                  velocity: vy,
                  damping: 30,
                  mass: 1,
                  stiffness: 225,
                  restDisplacementThreshold: 50,
                  restSpeedThreshold: 10,
                },
                (isFinish) => {
                  if (isFinish) {
                    props.focus.value = false;
                    props.vIndicatorOpacity.value = withDelay(1000, withTiming(0));
                    props.refreshAnimating.value = false;
                    props.loadMoreAnimating.value = false;
                  }
                },
              );
            } else {
              if (props.pagingEnabled === "vertical") {
                const pageHeight =
                  props.pageSize.height === 0 ? props.size.height.value : props.pageSize.height;
                let page = props.currentPage.value;
                if (evt.velocityY < -3) page++;
                else if (evt.velocityY > 3) page--;
                if (page < 0) page = 0;
                if (page > Math.ceil(props.contentSize.height.value / pageHeight) - 1)
                  page = Math.ceil(props.contentSize.height.value / pageHeight) - 1;
                props.currentPage.value = page;
                console.log("scrollto", page);
                props.contentOffset.y.value = withSpring(
                  page * pageHeight,
                  {
                    velocity: 50,
                    damping: 30,
                    mass: 1,
                    stiffness: 225,
                    restDisplacementThreshold: 50,
                    restSpeedThreshold: 10,
                  },
                  (isFinish) => {
                    if (isFinish) props.focus.value = false;
                  },
                );
              } else {
                props.contentOffset.y.value = withDecay(
                  {
                    velocity: vy,
                    deceleration: props.decelerationRate,
                    clamp: [-props.contentInsets.top.value, maxY],
                    rubberBandEffect: true,
                    rubberBandFactor: 0.1,
                  },
                  (isFinish) => {
                    if (!isFinish) return;
                    if (vBounces) {
                      props.contentOffset.y.value = withSpring(
                        props.contentOffset.y.value + 0.01,
                        {
                          velocity: vy,
                          damping: 200,
                          mass: 2,
                          stiffness: 225,
                          restDisplacementThreshold: 50,
                          restSpeedThreshold: 10,
                        },
                        (isFinish) => {
                          if (isFinish) {
                            props.focus.value = false;
                            props.vIndicatorOpacity.value = withDelay(1000, withTiming(0));
                          }
                        },
                      );
                    } else {
                      props.focus.value = false;
                      props.vIndicatorOpacity.value = withDelay(1000, withTiming(0));
                    }
                  },
                );
              }
            }
          }
          return true;
        },
      };

    const panHandlerWrapper = useAnimatedGestureHandler(panHandler);
    if (crossHeaderContext) {
      crossHeaderContext.onStart = panHandler.onStart;
      crossHeaderContext.onActive = panHandler.onActive;
      crossHeaderContext.onEnd = panHandler.onEnd;
    }
    const touchHandler = {
      onTouchStart: (evt) => {
        // console.log("onTouchStart");
        props.dragging.value = false;
        cancelAnimation(props.contentOffset.x);
        cancelAnimation(props.contentOffset.y);
        cancelAnimation(props.vIndicatorOpacity);
        cancelAnimation(props.hIndicatorOpacity);
        props.onTouchBegin && props.onTouchBegin();
        props.tapToHideKeyboard && Keyboard.dismiss();
      },
      onTouchEnd: () => {
        // console.log("onTouchEnd");
        if (!props.focus.value) return;
        props.vIndicatorOpacity.value = withDelay(2000, withTiming(0));
        props.hIndicatorOpacity.value = withDelay(2000, withTiming(0));
        const maxX =
          props.contentSize.width.value - props.size.width.value + props.contentInsets.right.value;
        let maxY =
          props.contentSize.height.value +
          props.contentInsets.bottom.value -
          props.size.height.value;
        props.onTouchEnd && props.onTouchEnd();
        if (props.pagingEnabled === "horizontal") {
          const pageWidth =
            props.pageSize.width === 0 ? props.size.width.value : props.pageSize.width;
          if (props.currentPage.value * pageWidth !== props.contentOffset.x.value) {
            props.contentOffset.x.value = withSpring(
              props.currentPage.value * pageWidth,
              {
                velocity: 50,
                damping: 30,
                mass: 1,
                stiffness: 225,
                restDisplacementThreshold: 50,
                restSpeedThreshold: 10,
              },
              (isFinish) => {
                if (isFinish) {
                  props.focus.value = false;
                }
              },
            );
            return;
          }
        }

        if (props.pagingEnabled === "vertical") {
          const pageHeight =
            props.pageSize.height === 0 ? props.size.height.value : props.pageSize.height;
          if (props.currentPage.value * pageHeight !== props.contentOffset.y.value) {
            props.contentOffset.y.value = withSpring(
              page * pageHeight,
              {
                velocity: 50,
                damping: 30,
                mass: 1,
                stiffness: 225,
                restDisplacementThreshold: 50,
                restSpeedThreshold: 10,
              },
              (isFinish) => {
                if (isFinish) props.focus.value = false;
              },
            );
            return;
          }
        }
        if (props.bounces === true || props.bounces === "vertical") {
          if (isOutOfVertical()) {
            props.contentOffset.y.value = withSpring(
              isOutOfTop() ? -props.contentInsets.top.value : maxY,
              {
                velocity: 50,
                damping: 30,
                mass: 1,
                stiffness: 225,
                restDisplacementThreshold: 50,
                restSpeedThreshold: 10,
              },
              (isFinish) => {
                if (isFinish) {
                  props.focus.value = false;
                  props.vIndicatorOpacity.value = withDelay(1000, withTiming(0));
                  props.refreshAnimating.value = false;
                  props.loadMoreAnimating.value = false;
                }
              },
            );
          }
        }
        if (props.bounces === true || props.bounces === "horizontal") {
          if (isOutOfHorizontal()) {
            props.contentOffset.x.value = withSpring(
              isOutOfLeft() ? -props.contentInsets.left.value : maxX,
              {
                velocity: 50,
                damping: 30,
                mass: 1,
                stiffness: 225,
                restDisplacementThreshold: 50,
                restSpeedThreshold: 10,
              },
              (isFinish) => {
                if (isFinish) {
                  props.focus.value = false;
                  props.hIndicatorOpacity.value = withDelay(1000, withTiming(0));
                }
              },
            );
          }
        }
      },
      onTouchCancel: () => {
        // console.log("onTouchCancel");
      },
    };
    useAnimatedReaction(
      () => {
        return { x: props.contentOffset.x.value, y: props.contentOffset.y.value };
      },
      (offset, previous) => {
        if (!previous || offset.x !== previous.x || offset.y !== previous.y) {
          if (props.onScrollUI) props.onScrollUI(props.contentOffset);
          if (props.onScroll) runOnJS(props.onScroll)(offset);
        }
      },
    );

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
        paddingTop: crossHeaderContext?.crossHeaderHeight.value,
        transform: [
          { translateX: -props.contentOffset.x.value },
          { translateY: -props.contentOffset.y.value },
        ],
      };
    });
    const vIndicatorStyle = useAnimatedStyle(() => {
      return {
        opacity: props.vIndicatorOpacity.value,
        height: props.contentSize.height.value
          ? (props.size.height.value * props.size.height.value) / props.contentSize.height.value - 6
          : props.contentSize.height.value,
        transform: [
          {
            translateY: props.contentSize.height.value
              ? (props.contentOffset.y.value * props.size.height.value) /
                props.contentSize.height.value
              : 0,
          },
        ],
      };
    });
    const hIndicatorStyle = useAnimatedStyle(() => {
      return {
        opacity: props.hIndicatorOpacity.value,
        width: props.contentSize.width.value
          ? (props.size.width.value * props.size.width.value) / props.contentSize.width.value - 6
          : props.contentSize.width.value,
        transform: [
          {
            translateX: props.contentSize.width.value
              ? (props.contentOffset.x.value * props.size.width.value) /
                props.contentSize.width.value
              : 0,
          },
        ],
      };
    });
    const refreshHeaderStyle = useAnimatedStyle(() => {
      return {
        left: 0,
        right: 0,
        position: "absolute",
        top: -props.refreshHeader.height,
        height: props.refreshHeader.height,
        transform: [{ translateY: -props.contentOffset.y.value }],
      };
    });
    const loadMoreFooterStyle = useAnimatedStyle(() => {
      let translateY =
        props.contentSize.height.value - props.size.height.value - props.contentOffset.y.value;
      return {
        left: 0,
        right: 0,
        position: "absolute",
        bottom: -props.loadingFooter.height,
        height: props.loadingFooter.height,
        transform: [{ translateY }],
      };
    });
    const loadingFooterOffset = useDerivedValue(() => {
      return (
        props.contentOffset.y.value - (props.contentSize.height.value - props.size.height.value)
      );
    });
    return (
      <PanGestureHandler
        activeOffsetY={[-5, 5]}
        activeOffsetX={[-10, 10]}
        failOffsetX={hScroll ? undefined : [-8, 8]}
        failOffsetY={vScroll ? undefined : [-8, 8]}
        enabled={!!props.scrollEnabled}
        onGestureEvent={panHandlerWrapper}
      >
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
            <PanHandlerContext.Provider value={panHandler}>
              {props.children}
            </PanHandlerContext.Provider>
          </Reanimated.View>
          {props.onRefresh && (
            <Reanimated.View style={refreshHeaderStyle}>
              <props.refreshHeader
                offset={props.contentOffset.y}
                maxHeight={props.refreshHeader.height}
                ref={props.refreshHeaderRef}
              />
            </Reanimated.View>
          )}
          {!props.allLoaded && props.onLoadingMore && (
            <Reanimated.View style={loadMoreFooterStyle}>
              <props.loadingFooter
                offset={loadingFooterOffset}
                maxHeight={props.loadingFooter.height}
                ref={props.loadMoreFooterRef}
              />
            </Reanimated.View>
          )}
          <Reanimated.View style={[styles.hIndicator, hIndicatorStyle]} />
          <Reanimated.View style={[styles.vIndicator, vIndicatorStyle]} />
        </Reanimated.View>
      </PanGestureHandler>
    );
  };

  shouldComponentUpdate(next) {
    const {
      size,
      contentSize,
      contentOffset,
      contentInsets,
      refreshingInner,
      refreshHeader,
      refreshAnimating,
      refreshStatus,
      refreshHeaderRef,
      loadingMoreInner,
      loadingFooter,
      loadMoreAnimating,
      loadMoreStatus,
      loadMoreFooterRef,
      hIndicatorOpacity,
      vIndicatorOpacity,
    } = this.props;
    if (!next.showsHorizontalScrollIndicator) hIndicatorOpacity.value = 0;
    if (!next.showsVerticalScrollIndicator) vIndicatorOpacity.value = 0;

    if (refreshingInner.value !== next.refreshing) {
      if (next.refreshing) {
        this.beginRefresh();
      } else {
        this.endRefresh();
      }
    }
    if (loadingMoreInner.value !== next.loadingMore) {
      if (next.loadingMore) {
        this.beginLoadingMore();
      } else {
        this.endLoadingMore();
      }
    }
    return !next.preventReRender;
  }

  beginRefresh() {
    const {
      contentInsets,
      contentOffset,
      refreshAnimating,
      refreshStatus,
      refreshHeaderRef,
      refreshHeader,
      refreshingInner,
    } = this.props;
    refreshAnimating.value = true;
    refreshingInner.value = true;
    refreshStatus.value = "refreshing";
    refreshHeaderRef.current?.changeToState("refreshing");
    if (!refreshAnimating.value) {
      cancelAnimation(contentOffset.y);
      const to = refreshHeader.height;
      contentInsets.top.value = to;
      contentOffset.y.value = withSpring(
        -to,
        {
          velocity: -10,
          damping: 30,
          mass: 1,
          stiffness: 225,
          restDisplacementThreshold: 50,
          restSpeedThreshold: 10,
        },
        (isFinish) => {
          refreshAnimating.value = false;
        },
      );
    }
  }

  endRefresh() {
    const {
      contentInsets,
      contentOffset,
      refreshAnimating,
      refreshStatus,
      refreshHeaderRef,
      refreshHeader,
      refreshingInner,
    } = this.props;
    refreshingInner.value = false;
    refreshStatus.value = "rebound";
    refreshHeaderRef.current?.changeToState("rebound");
    if (!refreshAnimating.value) {
      const reboundCallback = () => refreshHeaderRef.current?.changeToState("waiting");
      cancelAnimation(contentOffset.y);
      contentInsets.top.value = 0;
      contentOffset.y.value = withSpring(
        0,
        {
          velocity: -10,
          damping: 30,
          mass: 1,
          stiffness: 225,
          restDisplacementThreshold: 50,
          restSpeedThreshold: 10,
        },
        (isFinish) => {
          refreshStatus.value = "waiting";
          runOnJS(reboundCallback)();
        },
      );
    }
  }

  beginLoadingMore() {
    const {
      loadingMoreInner,
      contentInsets,
      loadMoreStatus,
      loadMoreFooterRef,
      loadMoreAnimating,
      contentSize,
      size,
      contentOffset,
      loadingFooter,
    } = this.props;
    loadingMoreInner.value = true;
    contentInsets.bottom.value = loadingFooter.height;
    loadMoreAnimating.value = true;
    loadMoreStatus.value = "loading";
    loadMoreFooterRef.current?.changeToState("loading");
    if (!loadMoreAnimating.value) {
      const reboundCallback = () => loadMoreFooterRef.current?.changeToState("waiting");
      cancelAnimation(contentOffset.y);
      const to = contentSize.height.value - size.height.value + loadingFooter.height;
      contentOffset.y.value = withSpring(
        to,
        {
          velocity: 10,
          damping: 30,
          mass: 1,
          stiffness: 225,
          restDisplacementThreshold: 50,
          restSpeedThreshold: 10,
        },
        (isFinish) => {
          loadMoreAnimating.value = false;
        },
      );
    }
  }

  endLoadingMore(rebound = true) {
    const {
      loadingMoreInner,
      contentInsets,
      loadMoreStatus,
      loadMoreFooterRef,
      loadMoreAnimating,
      contentSize,
      size,
      contentOffset,
    } = this.props;
    loadingMoreInner.value = false;
    contentInsets.bottom.value = 0;
    loadMoreStatus.value = rebound ? "rebound" : "waiting";
    loadMoreFooterRef.current?.changeToState(loadMoreStatus.value);
    if (rebound && !loadMoreAnimating.value) {
      const reboundCallback = () => loadMoreFooterRef.current?.changeToState("waiting");
      cancelAnimation(contentOffset.y);
      const to = contentSize.height.value - size.height.value;
      contentOffset.y.value = withSpring(
        to,
        {
          velocity: 10,
          damping: 30,
          mass: 1,
          stiffness: 225,
          restDisplacementThreshold: 50,
          restSpeedThreshold: 10,
        },
        (isFinish) => {
          loadMoreStatus.value = "waiting";
          runOnJS(reboundCallback)();
        },
      );
    }
  }

  scrollTo(offset, animated: boolean = true): Promise<void> {
    const { contentOffset } = this.props;
    if (!animated) {
      contentOffset.x.value = offset.x;
      contentOffset.y.value = offset.y;
      return Promise.resolve();
    }
    cancelAnimation(contentOffset.x);
    cancelAnimation(contentOffset.y);
    const xPromise = new Promise((resolve, reject) => {
      contentOffset.x.value = withSpring(
        offset.x,
        {
          velocity: 10,
          damping: 30,
          mass: 1,
          stiffness: 225,
          restDisplacementThreshold: 50,
          restSpeedThreshold: 10,
        },
        (isFinish) => {
          if (isFinish) runOnJS(resolve)();
          else runOnJS(reject)();
        },
      );
    });

    const yPromise = new Promise((resolve, reject) => {
      contentOffset.y.value = withSpring(
        offset.y,
        {
          velocity: 10,
          damping: 30,
          mass: 1,
          stiffness: 225,
          restDisplacementThreshold: 50,
          restSpeedThreshold: 10,
        },
        (isFinish) => {
          if (isFinish) runOnJS(resolve)();
          else runOnJS(reject)();
        },
      );
    });
    return Promise.all([xPromise, yPromise]);
  }

  scroll(offset, animated: boolean = true): Promise<void> {
    return this.scrollTo(
      {
        x: offset.x + this.props.contentOffset.x.value,
        y: offset.y + this.props.contentOffset.y.value,
      },
      animated,
    );
  }

  _onKeyboardWillShow = (evt) => {
    this.props.textInputRefs.every((input) => {
      if (input.current?.isFocused()) {
        input.current.measureInWindow((x, y, w, h, l, t) => {
          const offset = -evt.endCoordinates.screenY + this.props.inputToolBarHeight + y + h;
          if (offset > 0) {
            this.props.keyboardOffset.value = offset;
            this.scroll({ x: 0, y: offset }).catch(() => 0);
          }
        });
        return false;
      }
      return true;
    });
  };

  _onKeyboardWillHide = () => {
    if (this.props.keyboardOffset.value > 0) {
      this.props.keyboardOffset.value = 0;
      this.scroll({ x: 0, y: -this.props.keyboardOffset.value }).catch(() => 0);
    }
  };

  componentDidMount() {
    this._keyboardShowSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      this._onKeyboardWillShow,
    );
    this._keyboardHideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      this._onKeyboardWillHide,
    );
  }

  componentWillUnmount() {
    this._keyboardShowSub.remove();
    this._keyboardHideSub.remove();
  }
}
