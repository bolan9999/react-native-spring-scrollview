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
  ViewPropTypes,
  Keyboard,
  Platform,
  Text,
  View
} from "react-native";
import { PanGestureHandler as Pan, State } from "react-native-gesture-handler";
import { idx } from "./idx";
import { RefreshHeader } from "./RefreshHeader";
import { propsEqualExcept } from "./PropsTool";
import { LoadingFooter } from "./LoadingFooter";

export class VerticalScrollView extends React.Component<PropType> {
  _panHandler;
  _panOffsetY: Animated.Value;
  _animatedOffsetY: Animated.Value;

  _innerDecelerationVelocity: number = 0;
  _innerDecelerationStartTime: number;

  _contentOffsetY: Animated.Value;
  _touching: boolean = false;

  _animatedOffsetYValue: number = 0;
  _panOffsetYValue: number = 0;
  _lastPanOffsetYValue: number = 0;
  _contentOffsetYValue: number = 0;

  _contentLayout: Frame;
  _wrapperLayout: Frame;
  _layoutChanged: boolean = false;
  _contentView;
  _indicator;
  _indicatorOpacity: Animated.Value;
  _indicatorAnimate;
  _keyboardShowSub;
  _keyboardHideSub;

  _refreshHeader;
  _enoughToRefresh: boolean = false;
  _cancelRefresh: boolean = false;
  _enoughLoadMore: boolean = false;
  _cancelLoadMore: boolean = false;

  _innerDeceleration;
  _outerDeceleration;
  _reboundToRefresh;
  _endRefreshRebound;
  _reboundLoading;
  _loadingFooter;
  _endLoadingRebound;

  static defaultProps = {
    decelerationRate: 0.998,
    showsVerticalScrollIndicator: true,
    scrollEnabled: true,
    dampingCoefficient: 0.5,
    decelerationRateWhenOut: 0.9,
    reboundEasing: Easing.cos,
    reboundDuration: 300,
    onScroll: () => null,
    getOffsetYAnimatedValue: () => null,
    textInputRefs: [],
    inputToolBarHeight: 44,
    tapToHideKeyboard: true,
    refreshHeaderHeight: 80,
    refreshing: false,
    loadingFooterHeight: 80,
    loading: false
  };

  constructor(props: PropType) {
    super(props);
    this._panOffsetY = new Animated.Value(0);
    this._animatedOffsetY = new Animated.Value(0);
    this._indicatorOpacity = new Animated.Value(1);
    this._contentOffsetY = new Animated.Value(0);
    this._animatedOffsetY.addListener(({ value: v }) => {
      this._animatedOffsetYValue = v;
      this._onScroll(v + this._panOffsetYValue);
      if (this._innerDeceleration) {
        //碰边检测
        const beyondOffset =
          -this._contentLayout.height +
          this._wrapperLayout.height -
          this._lastPanOffsetYValue;
        if (this._contentOffsetYValue < 0) {
          this._beginOuterDeceleration();
        } else if (this._animatedOffsetYValue < beyondOffset) {
          this._beginOuterDeceleration();
        }
      }
    });
    this.componentWillReceiveProps(props);
  }

  componentWillReceiveProps(props: PropType) {
    this._panHandler = !props.scrollEnabled
      ? Animated.event(
          [
            {
              nativeEvent: {}
            }
          ],
          { useNativeDriver: true }
        )
      : Animated.event(
          [
            {
              nativeEvent: {
                translationY: this._panOffsetY
              }
            }
          ],
          {
            listener: this._panListener,
            useNativeDriver: true
          }
        );
    if (!this._refreshHeader || !this._loadingFooter) return;
    if (props.refreshing && !this.props.refreshing) {
      this._beginReboundToRefresh();
    } else if (!props.refreshing && this.props.refreshing) {
      this._beginEndRefreshRebound();
    }
    if (props.loading && !this.props.loading) {
      this._beginReboundLoading();
    } else if (!props.loading && this.props.loading) {
      this._beginEndLoadingRebound();
    }
  }

  shouldComponentUpdate(nextProps: PropType) {
    return !propsEqualExcept(
      nextProps,
      this.props,
      [
        "decelerationRate",
        "decelerationRateWhenOut",
        "reboundEasing",
        "reboundDuration",
        "textInputRefs",
        "inputToolBarHeight",
        "tapToHideKeyboard",
        "refreshing",
        "loading"
      ],
      ["style", "contentStyle"]
    );
  }

  render() {
    const { contentStyle } = this.props;
    this._getContentOffsetY();
    this._getIndicator();
    this._layoutChanged = false;
    const cStyle = StyleSheet.flatten([
      contentStyle,
      {
        transform: [{ translateY: this._contentOffsetY }]
      }
    ]);
    const headerStyle = this._getRefreshHeaderStyle();
    const footerStyle = this._getLoadingFooterStyle();
    const Refresh = this.props.refreshHeader;
    const Loading = this.props.loadingFooter;
    return (
      <Pan
        minDist={Platform.OS === "ios" ? 0 : 5}
        minOffsetY={5}
        onGestureEvent={this._panHandler}
        onHandlerStateChange={this._onHandlerStateChange}
      >
        <Animated.View {...this.props} onLayout={this._onWrapperLayout}>
          {Refresh &&
            <Animated.View style={headerStyle}>
              <Refresh
                ref={ref => (this._refreshHeader = ref)}
                offset={this._contentOffsetY}
                maxHeight={this.props.refreshHeaderHeight}
              />
            </Animated.View>}
          <Animated.View
            style={cStyle}
            onLayout={this._onLayout}
            ref={ref => (this._contentView = ref)}
          >
            {this.props.children}
          </Animated.View>
          {Loading &&
            <Animated.View style={footerStyle}>
              <Loading
                ref={ref => (this._loadingFooter = ref)}
                offset={this._contentOffsetY}
                maxHeight={this.props.loadingFooterHeight}
              />
            </Animated.View>}
          {this._indicator}
        </Animated.View>
      </Pan>
    );
  }

  componentDidMount() {
    this._beginIndicatorDismissAnimation();
    this._keyboardShowSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      this._onKeyboardWillShow
    );
    this._keyboardHideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      this._onKeyboardWillHide
    );
  }

  componentWillUnmount() {
    this._keyboardShowSub.remove();
    this._keyboardHideSub.remove();
  }

  _onKeyboardWillShow = evt => {
    // console.log("=====>Show", JSON.stringify(evt));
    this.props.textInputRefs.every(input => {
      if (idx(() => input.current.isFocused())) {
        input.current.measure((x, y, w, h, l, t) => {
          // console.log("=====>measure",x,y,w,h,l,t );
          if (
            t + h >
            evt.endCoordinates.screenY - this.props.inputToolBarHeight
          ) {
            let y =
              this._contentOffsetYValue +
              t +
              h -
              evt.endCoordinates.screenY +
              this.props.inputToolBarHeight;
            const maxOffset =
              this._contentLayout.height - this._wrapperLayout.height;
            if (y > maxOffset && Platform.OS === "ios") {
              y = maxOffset + (y - maxOffset) / this.props.dampingCoefficient;
            }
            this._forceScrollTo({ x: 0, y: y });
          }
        });
        return false;
      }
      return true;
    });
  };

  _onKeyboardWillHide = () => {
    this.scrollTo({ x: 0, y: this._contentOffsetYValue });
  };

  _onHandlerStateChange = ({ nativeEvent: event }) => {
    switch (event.state) {
      case State.BEGAN:
        this._onTouchBegin();
        break;
      case State.CANCELLED:
        break;
      case State.FAILED:
      case State.END:
        this._onTouchEnd(event.translationY, event.velocityY / 1000);
    }
  };

  _getContentOffsetY() {
    let { dampingCoefficient, bounces } = this.props;
    if (!bounces) dampingCoefficient = 0;
    if (this._layoutChanged) {
      this._contentOffsetY = Animated.add(
        this._panOffsetY,
        this._animatedOffsetY
      ).interpolate({
        inputRange: [
          Number.MIN_SAFE_INTEGER,
          -this._contentLayout.height + this._wrapperLayout.height,
          0,
          Number.MAX_SAFE_INTEGER
        ],
        outputRange: [
          Number.MIN_SAFE_INTEGER * dampingCoefficient,
          -this._contentLayout.height + this._wrapperLayout.height,
          0,
          Number.MAX_SAFE_INTEGER * dampingCoefficient
        ]
      });
      setTimeout(() =>
        this.props.getOffsetYAnimatedValue(this._contentOffsetY)
      );
    }
  }

  _getIndicator() {
    if (!this.props.showsVerticalScrollIndicator) {
      this._indicator = null;
      return;
    }
    if (this._layoutChanged) {
      const style = StyleSheet.flatten([
        styles.indicator,
        {
          height:
            this._wrapperLayout.height *
            this._wrapperLayout.height /
            this._contentLayout.height,
          opacity: this._indicatorOpacity,
          transform: [
            {
              translateY: this._contentOffsetY.interpolate({
                inputRange: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
                outputRange: [
                  Number.MAX_SAFE_INTEGER *
                    this._wrapperLayout.height /
                    this._contentLayout.height,
                  Number.MIN_SAFE_INTEGER *
                    this._wrapperLayout.height /
                    this._contentLayout.height
                ]
              })
            }
          ]
        }
      ]);
      this._indicator = <Animated.View style={style} />;
    }
  }

  _onScroll(addition: number) {
    let { dampingCoefficient, bounces } = this.props;
    if (!bounces) dampingCoefficient = 0;
    let newOffset = -addition;
    if (addition > 0) {
      newOffset = -addition * dampingCoefficient;
    }
    if (this._wrapperLayout && this._contentLayout) {
      const wHeight = this._wrapperLayout.height;
      const cHeight = this._contentLayout.height;
      if (addition < -cHeight + wHeight) {
        newOffset =
          cHeight -
          wHeight +
          (-addition - (cHeight - wHeight)) * dampingCoefficient;
      }
    }
    if (this._contentOffsetYValue !== newOffset) {
      this._contentOffsetYValue = newOffset;
      this.props.onScroll({ x: 0, y: this._contentOffsetYValue });
    }
  }

  _onLayout = ({ nativeEvent: { layout: layout } }) => {
    const oW = idx(() => this._contentLayout.width, 0);
    const oH = idx(() => this._contentLayout.height, 0);
    if (oW !== layout.widget && oH !== layout.height) {
      this._layoutChanged = true;
      this._contentLayout = layout;
      this._onLayoutConfirm();
    }
  };
  _onWrapperLayout = ({ nativeEvent: { layout: layout } }) => {
    const oW = idx(() => this._wrapperLayout.width, 0);
    const oH = idx(() => this._wrapperLayout.height, 0);
    if (oW !== layout.widget && oH !== layout.height) {
      this._layoutChanged = true;
      this._wrapperLayout = layout;
      this._onLayoutConfirm();
    }
  };

  _forceScrollTo(offset: Offset, animated: boolean = true) {
    const to = -offset.y - this._panOffsetYValue;
    if (!animated) this._animatedOffsetY.setValue(to);
    Animated.timing(this._animatedOffsetY, {
      toValue: to,
      duration: 250,
      useNativeDriver: true
    }).start();
  }

  scrollTo(offset: Offset, animated: boolean = true) {
    if (offset.y > this._contentLayout.height - this._wrapperLayout.height)
      offset.y = this._contentLayout.height - this._wrapperLayout.height;
    if (offset.y < 0) offset.y = 0;
    const to = -offset.y - this._panOffsetYValue;
    if (!animated) this._animatedOffsetY.setValue(to);
    Animated.timing(this._animatedOffsetY, {
      toValue: to,
      duration: 250,
      useNativeDriver: true
    }).start();
  }

  _onLayoutConfirm() {
    if (this._layoutChanged && this._contentLayout && this._wrapperLayout) {
      this.forceUpdate();
      if (
        this._contentOffsetYValue < 0 ||
        this._contentOffsetYValue >
          this._contentLayout.height - this._wrapperLayout.height
      ) {
        this.scrollTo({ x: 0, y: this._contentOffsetYValue });
      }
    }
  }

  _beginInnerDeceleration(velocity: number) {
    this._innerDecelerationVelocity = velocity;
    this._innerDeceleration = Animated.decay(this._animatedOffsetY, {
      velocity: this._innerDecelerationVelocity,
      deceleration: this.props.decelerationRate,
      useNativeDriver: true
    });
    this._innerDecelerationStartTime = new Date().getTime();
    this._innerDeceleration.start(({ finished: finished }) => {
      this._innerDecelerationStartTime = 0;
      this._innerDeceleration = null;
      this._innerDecelerationVelocity = 0;
      if (finished) this._beginIndicatorDismissAnimation();
    });
  }

  _beginOuterDeceleration() {
    const animatedTime =
      new Date().getTime() - this._innerDecelerationStartTime;
    const velocity =
      this._innerDecelerationVelocity *
      Math.pow(this.props.decelerationRate, animatedTime);
    this._innerDeceleration.stop();
    if (!this.props.bounces)
      return this._animatedOffsetY.setValue(-this._lastPanOffsetYValue);
    this._outerDeceleration = Animated.decay(this._animatedOffsetY, {
      velocity: velocity,
      deceleration: this.props.decelerationRateWhenOut,
      useNativeDriver: true
    });
    this._outerDeceleration.start(({ finished: finished }) => {
      this._outerDeceleration = null;
      if (finished) {
        if (this._contentOffsetYValue < -this.props.refreshHeaderHeight) {
          if (this._enoughToRefresh) {
            if (this.props.onRefresh) this.props.onRefresh();
            else this._beginEndRefreshRebound(false);
            idx(() => this._refreshHeader.changeToState("refreshing"));
          } else {
            this._beginEndRefreshRebound(false);
          }
        } else if (
          this._contentOffsetYValue >
          this._contentLayout.height - this._wrapperLayout.height
        ) {
          if (this._enoughLoadMore) {
            if (this.props.onLoading) this.props.onLoading();
            else this._beginEndLoadingRebound(false);
            idx(() => this._loadingFooter.changeToState("loading"));
          } else {
            this._beginEndLoadingRebound(false);
          }
        } else if (
          this._contentOffsetYValue > -this.props.refreshHeaderHeight
        ) {
          this._beginEndRefreshRebound(false);
        } else {
          this._beginEndLoadingRebound(false);
        }
      }
    });
  }

  _beginReboundToRefresh() {
    const {
      dampingCoefficient,
      refreshHeaderHeight,
      reboundDuration,
      reboundEasing
    } = this.props;
    this._reboundToRefresh = Animated.timing(this._animatedOffsetY, {
      toValue: refreshHeaderHeight / dampingCoefficient - this._panOffsetYValue,
      duration: reboundDuration,
      easing: reboundEasing,
      useNativeDriver: true
    });
    this._reboundToRefresh.start(({ finished: finished }) => {
      this._reboundToRefresh = null;
    });
  }

  _beginEndRefreshRebound(rebound: boolean = true) {
    idx(() =>
      this._refreshHeader.changeToState(rebound ? "rebound" : "cancelRefresh")
    );
    this._endRefreshRebound = Animated.timing(this._animatedOffsetY, {
      toValue: -this._panOffsetYValue,
      duration: this.props.reboundDuration,
      easing: this.props.reboundEasing,
      useNativeDriver: true
    });
    this._endRefreshRebound.start(({ finished: finished }) => {
      this._endRefreshRebound = null;
      if (finished) {
        this._enoughToRefresh = false;
        this._cancelRefresh = false;
        idx(() => this._refreshHeader.changeToState("waiting"));
      }
    });
  }

  _beginReboundLoading() {
    const {
      dampingCoefficient,
      loadingFooterHeight,
      reboundDuration,
      reboundEasing
    } = this.props;
    this._reboundLoading = Animated.timing(this._animatedOffsetY, {
      toValue:
        this._wrapperLayout.height -
        this._contentLayout.height -
        loadingFooterHeight / dampingCoefficient -
        this._panOffsetYValue,
      duration: reboundDuration,
      easing: reboundEasing,
      useNativeDriver: true
    });
    this._reboundLoading.start(({ finished: finished }) => {
      this._reboundLoading = null;
    });
  }

  _beginEndLoadingRebound(rebound: boolean = true) {
    idx(() =>
      this._loadingFooter.changeToState(rebound ? "rebound" : "cancelLoading")
    );
    this._endLoadingRebound = Animated.timing(this._animatedOffsetY, {
      toValue:
        this._wrapperLayout.height -
        this._contentLayout.height -
        this._panOffsetYValue,
      duration: this.props.reboundDuration,
      easing: this.props.reboundEasing,
      useNativeDriver: true
    });
    this._endLoadingRebound.start(({ finished: finished }) => {
      this._endLoadingRebound = null;
      if (finished) {
        this._enoughLoadMore = false;
        this._cancelLoadMore = false;
        idx(() => this._loadingFooter.changeToState("waiting"));
      }
    });
  }

  _onTouchBegin() {
    this._touching = true;
    if (this.props.scrollEnabled) {
      this._innerDeceleration && this._innerDeceleration.stop();
      this._outerDeceleration && this._outerDeceleration.stop();
      this._reboundToRefresh && this._reboundToRefresh.stop();
      this._endRefreshRebound && this._endRefreshRebound.stop();
      this._indicatorAnimate && this._indicatorAnimate.stop();
      this.props.scrollEnabled && this._indicatorOpacity.setValue(1);
    }
    if (this.props.tapToHideKeyboard) {
      Keyboard.dismiss();
    }
  }

  _onTouchEnd(offsetY: number, velocityY: number) {
    this._touching = false;
    if (!this.props.scrollEnabled) return;
    this._lastPanOffsetYValue += offsetY;
    this._panOffsetY.extractOffset();
    this._beginInnerDeceleration(velocityY);
  }

  _beginIndicatorDismissAnimation() {
    this._indicatorAnimate && this._indicatorAnimate.stop();
    this._indicatorAnimate = Animated.timing(this._indicatorOpacity, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true
    });
    this._indicatorAnimate.start(() => {
      this._indicatorAnimate = null;
    });
  }

  _getRefreshHeaderStyle() {
    const { refreshHeaderHeight } = this.props;
    return {
      position: "absolute",
      left: 0,
      right: 0,
      top: -refreshHeaderHeight,
      height: refreshHeaderHeight,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      transform: [
        {
          translateY: this._contentOffsetY.interpolate({
            inputRange: [
              Number.MIN_SAFE_INTEGER,
              0,
              refreshHeaderHeight,
              Number.MAX_SAFE_INTEGER
            ],
            outputRange: [0, 0, refreshHeaderHeight, refreshHeaderHeight]
          })
        }
      ]
    };
  }

  _getLoadingFooterStyle() {
    const { loadingFooterHeight } = this.props;
    const bottom =
      idx(() => this._contentLayout.height, 0) -
      idx(() => this._wrapperLayout.height, 0);
    return {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: -loadingFooterHeight,
      height: loadingFooterHeight,
      transform: [
        {
          translateY: this._contentOffsetY.interpolate({
            inputRange: [
              Number.MIN_SAFE_INTEGER,
              -bottom - loadingFooterHeight,
              -bottom,
              Number.MAX_SAFE_INTEGER
            ],
            outputRange: [-loadingFooterHeight, -loadingFooterHeight, 0, 0]
          })
        }
      ]
    };
  }

  _panListener = e => {
    const v = e.nativeEvent.translationY;
    const { refreshHeaderHeight } = this.props;
    this._panOffsetYValue = this._lastPanOffsetYValue + v;
    this._onScroll(this._panOffsetYValue + this._animatedOffsetYValue);
    const offset = this._contentOffsetYValue;
    const bottom = idx(
      () => this._contentLayout.height - this._wrapperLayout.height
    );
    if (offset < 0) {
      if (offset > -refreshHeaderHeight) {
        if (!this._enoughToRefresh) {
          idx(() => this._refreshHeader.changeToState("pulling"));
        } else {
          this._cancelRefresh = true;
          idx(() => this._refreshHeader.changeToState("pullingCancel"));
        }
      } else {
        this._enoughToRefresh = true;
        this._cancelRefresh = false;
        idx(() => this._refreshHeader.changeToState("pullingEnough"));
      }
    } else if (offset > bottom) {
      if (offset < bottom + this.props.loadingFooterHeight) {
        if (!this._enoughLoadMore) {
          idx(() => this._loadingFooter.changeToState("dragging"));
        } else {
          this._cancelLoadMore = true;
          idx(() => this._loadingFooter.changeToState("draggingCancel"));
        }
      } else {
        this._enoughLoadMore = true;
        this._cancelLoadMore = false;
        idx(() => this._loadingFooter.changeToState("draggingEnough"));
      }
    }
  };
}

const styles = StyleSheet.create({
  indicator: {
    position: "absolute",
    top: 0,
    right: 2,
    backgroundColor: "#A8A8A8",
    width: 3,
    height: 100,
    borderRadius: 3
  }
});

interface Frame {
  x: number,
  y: number,
  width: number,
  height: number
}

interface Offset {
  x: number,
  y: number
}

interface PropType extends ViewPropTypes {
  bounces?: boolean,
  contentStyle?: Object,
  scrollEnabled?: boolean,
  onScroll?: (offset: Offset) => any,
  showsVerticalScrollIndicator?: boolean,
  decelerationRate?: number,
  decelerationRateWhenOut?: number,
  dampingCoefficient?: number,
  reboundEasing?: (value: number) => number,
  reboundDuration?: number,
  getOffsetYAnimatedValue?: (offset: AnimatedWithChildren) => any,

  textInputRefs?: any[],
  tapToHideKeyboard?: boolean,
  inputToolBarHeight?: number,

  refreshHeaderHeight?: number,
  refreshHeader?: RefreshHeader,
  refreshing?: boolean,
  onRefresh?: () => any,
  onCancelRefresh?: () => any,

  loadingFooterHeight?: number,
  loadingFooter?: LoadingFooter,
  loading?: boolean,
  onLoading?: () => any,
  onCancelLoading?: () => any

  //键盘处理
  // onContentLayoutChange?: (layout: Frame) => any,
  // renderIndicator?: () => React.Element<any>,
}
