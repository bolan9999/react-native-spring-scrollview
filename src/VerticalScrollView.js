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
  Platform
} from "react-native";
import { PanGestureHandler as Pan, State } from "react-native-gesture-handler";
import { idx } from "./idx";
import { RefreshHeader } from "./RefreshHeader";
import { LoadingFooter } from "./LoadingFooter";

export class VerticalScrollView extends React.Component<PropType> {
  _panHandler;
  _panOffsetY: Animated.Value = new Animated.Value(0);
  _animatedOffsetY: Animated.Value = new Animated.Value(0);
  _innerDecelerationVelocity: number = 0;
  _innerDecelerationStartTime: number;
  _contentOffsetY: Animated.Value = new Animated.Value(0);
  _keyboardOffset: Animated.Value = new Animated.Value(0);
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
  _indicatorOpacity: Animated.Value = new Animated.Value(1);
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
  _headerAnimatedValue;
  _footerAnimatedValue;
  _decelating = false;

  static defaultProps = {
    bounces: true,
    decelerationRate: 0.998,
    showsVerticalScrollIndicator: true,
    scrollEnabled: true,
    initOffset: { x: 0, y: 0 },
    dampingCoefficient: 0.5,
    decelerationRateWhenOut: 0.9,
    reboundEasing: Easing.cos,
    reboundDuration: 300,
    onScroll: () => null,
    getNativeOffset: () => null,
    textInputRefs: [],
    inputToolBarHeight: 44,
    tapToHideKeyboard: true,
    refreshHeaderHeight: 80,
    loadingFooterHeight: 80,
    allLoaded: false,
    onTouchBegin: () => null,
    onTouchEnd: () => null,
    onMomentumScrollStart: () => null,
    onMomentumScrollEnd: () => null,
    indicatorDismissTimeInterval: 3000
  };

  constructor(props: PropType) {
    super(props);
    this._animatedOffsetY.setValue(-props.initOffset.y);
    this._animatedOffsetY.addListener(({ value: v }) => {
      this._animatedOffsetYValue = v;
      this._onScroll(v + this._panOffsetYValue);
      if (this._innerDeceleration) {
        const beyondOffset =
          -this._contentLayout.height +
          this._wrapperLayout.height -
          this._lastPanOffsetYValue;
        if (this._contentOffsetYValue < 0.001) {
          this._beginOuterDeceleration(-this._lastPanOffsetYValue);
        } else if (this._animatedOffsetYValue < beyondOffset) {
          this._beginOuterDeceleration(beyondOffset);
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
  }

  render() {
    const { contentStyle } = this.props;
    this._getContentOffsetY();
    this._getIndicator();
    this._layoutChanged = false;
    const cStyle = StyleSheet.flatten([
      { overflow: "hidden" },
      contentStyle,
      {
        transform: [
          {
            translateY: Animated.add(this._contentOffsetY, this._keyboardOffset)
          }
        ]
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
                offset={this._headerAnimatedValue}
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
                offset={this._footerAnimatedValue}
                maxHeight={this.props.loadingFooterHeight}
                allLoaded={this.props.allLoaded}
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

  componentDidUpdate() {
    this._beginIndicatorDismissAnimation();
  }

  componentWillUnmount() {
    this._keyboardShowSub.remove();
    this._keyboardHideSub.remove();
  }

  _onKeyboardWillShow = evt => {
    this.props.textInputRefs.every(input => {
      if (idx(() => input.current.isFocused())) {
        input.current.measure((x, y, w, h, l, t) => {
          const offsetY =
            t + h - evt.endCoordinates.screenY + this.props.inputToolBarHeight;
          if (offsetY > 0) this._timingTo(this._keyboardOffset, -offsetY);
        });
        return false;
      }
      return true;
    });
  };

  _onKeyboardWillHide = () => {
    this._timingTo(this._keyboardOffset);
  };

  _onHandlerStateChange = ({ nativeEvent: event }) => {
    switch (event.state) {
      case State.BEGAN:
        this._onTouchBegin(event);
        break;
      case State.CANCELLED:
        break;
      case State.FAILED:
      case State.END:
        this._onTouchEnd(event.translationY, event.velocityY / 1000, event);
    }
  };

  _getContentOffsetY() {
    let { dampingCoefficient, bounces } = this.props;
    if (!bounces) dampingCoefficient = 0;
    if (this._layoutChanged) {
      const bOffset = this._contentLayout.height - this._wrapperLayout.height;
      this._contentOffsetY = Animated.add(
        this._panOffsetY,
        this._animatedOffsetY
      ).interpolate({
        inputRange: [-bOffset - 1, -bOffset, 0, 1],
        outputRange: [
          -bOffset - dampingCoefficient,
          -bOffset,
          0,
          dampingCoefficient
        ]
      });
      setTimeout(() => this.props.getNativeOffset(this._contentOffsetY));
    }
  }

  _getIndicator() {
    if (!this.props.showsVerticalScrollIndicator) {
      this._indicator = null;
      return;
    }

    if (this._layoutChanged) {
      const rate = this._wrapperLayout.height / this._contentLayout.height;
      const style = StyleSheet.flatten([
        styles.indicator,
        {
          height: this._wrapperLayout.height * rate,
          opacity: this._indicatorOpacity,
          transform: [
            {
              translateY: this._contentOffsetY.interpolate({
                inputRange: [-1, 1],
                outputRange: [rate, -rate]
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
    if (oW !== layout.width || oH !== layout.height) {
      this._layoutChanged = true;
      this._contentLayout = layout;
      this._onLayoutConfirm();
    }
  };
  _onWrapperLayout = ({ nativeEvent: { layout: layout } }) => {
    const oW = idx(() => this._wrapperLayout.width, 0);
    const oH = idx(() => this._wrapperLayout.height, 0);
    if (oW !== layout.widget || oH !== layout.height) {
      this._layoutChanged = true;
      this._wrapperLayout = layout;
      this._onLayoutConfirm();
    }
  };

  scrollTo(offset: Offset, animated: boolean = true): Promise<void> {
    if (offset.y > this._contentLayout.height - this._wrapperLayout.height)
      offset.y = this._contentLayout.height - this._wrapperLayout.height;
    if (offset.y < 0) offset.y = 0;
    const to = -offset.y - this._panOffsetYValue;
    this._innerDeceleration && this._innerDeceleration.stop();
    return new Promise(r => {
      if (!animated) {
        this._animatedOffsetY.setValue(to);
        r();
      }
      this._timingTo(this._animatedOffsetY, to, 250, r);
    });
  }

  _onLayoutConfirm() {
    if (this._layoutChanged && this._contentLayout && this._wrapperLayout) {
      if (this._contentLayout.height < this._wrapperLayout.height)
        this._contentLayout.height = this._wrapperLayout.height;
      this.forceUpdate();
      if (
        this._contentOffsetYValue < 0 ||
        this._contentOffsetYValue >
          this._contentLayout.height - this._wrapperLayout.height
      ) {
        this.scrollTo({ x: 0, y: this._contentOffsetYValue }).then();
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
    this.props.onMomentumScrollStart();
    this._decelating = true;
    this._innerDeceleration.start(({ finished: finished }) => {
      this._innerDecelerationStartTime = 0;
      this._innerDeceleration = null;
      this._innerDecelerationVelocity = 0;
      if (finished) {
        this._decelating = false;
        this.props.onMomentumScrollEnd();
        this._beginIndicatorDismissAnimation();
      }
    });
  }

  _beginOuterDeceleration(beyondOffset: number) {
    const animatedTime =
      new Date().getTime() - this._innerDecelerationStartTime;
    const velocity =
      this._innerDecelerationVelocity *
      Math.pow(this.props.decelerationRate, animatedTime);
    this._innerDeceleration.stop();
    if (!this.props.bounces)
      return this._animatedOffsetY.setValue(beyondOffset);
    this._outerDeceleration = Animated.decay(this._animatedOffsetY, {
      velocity: velocity,
      deceleration: this.props.decelerationRateWhenOut,
      useNativeDriver: true
    });
    this._outerDeceleration.start(({ finished: finished }) => {
      this._outerDeceleration = null;
      this._decelating = false;
      this.props.onMomentumScrollEnd();
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
            if (!this.props.allLoaded && this.props.onLoading)
              this.props.onLoading();
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
        this._beginIndicatorDismissAnimation();
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
        if (finished) this._beginIndicatorDismissAnimation();
      }
    });
  }

  _onTouchBegin(event) {
    if (this._decelating) {
      this._decelating = false;
      this.props.onMomentumScrollEnd();
    }
    this._touching = true;
    this.props.onTouchBegin(event);
    if (this.props.scrollEnabled) {
      this._innerDeceleration && this._innerDeceleration.stop();
      this._outerDeceleration && this._outerDeceleration.stop();
      this._reboundToRefresh && this._reboundToRefresh.stop();
      this._endRefreshRebound && this._endRefreshRebound.stop();
      this._indicatorAnimate && this._indicatorAnimate.stop();
      this._indicatorOpacity.setValue(1);
    }
    if (this.props.tapToHideKeyboard) {
      Keyboard.dismiss();
    }
  }

  _onTouchEnd(offsetY: number, velocityY: number, event) {
    this._touching = false;
    this.props.onTouchEnd(event);
    if (!this.props.scrollEnabled) return;
    this._lastPanOffsetYValue += offsetY;
    this._panOffsetY.extractOffset();
    this._beginInnerDeceleration(velocityY);
  }

  _beginIndicatorDismissAnimation() {
    this._indicatorAnimate && this._indicatorAnimate.stop();
    this._indicatorAnimate = Animated.timing(this._indicatorOpacity, {
      toValue: 0,
      duration: this.props.indicatorDismissTimeInterval,
      useNativeDriver: true
    });
    this._indicatorAnimate.start(({ finished: finished }) => {
      this._indicatorAnimate = null;
      if (!finished) this._indicatorOpacity.setValue(1);
    });
  }

  _getRefreshHeaderStyle() {
    const { refreshHeaderHeight } = this.props;
    this._headerAnimatedValue = this._contentOffsetY.interpolate({
      inputRange: [-1, 0, refreshHeaderHeight, refreshHeaderHeight + 1],
      outputRange: [0, 0, refreshHeaderHeight, refreshHeaderHeight]
    });
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
          translateY: this._headerAnimatedValue
        }
      ]
    };
  }

  _getLoadingFooterStyle() {
    const { loadingFooterHeight } = this.props;
    const bottom =
      idx(() => this._contentLayout.height, 0) -
      idx(() => this._wrapperLayout.height, 0);
    this._footerAnimatedValue = this._contentOffsetY.interpolate({
      inputRange: [
        -bottom - loadingFooterHeight - 1,
        -bottom - loadingFooterHeight,
        -bottom,
        -bottom + 1
      ],
      outputRange: [-loadingFooterHeight, -loadingFooterHeight, 0, 0]
    });
    return {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: -loadingFooterHeight,
      height: loadingFooterHeight,
      transform: [
        {
          translateY: this._footerAnimatedValue
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
    const bottom = this._contentLayout.height - this._wrapperLayout.height;
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

  _timingTo(animate, to = 0, duration = 250, callBack = () => null) {
    Animated.timing(animate, {
      toValue: to,
      duration: duration,
      useNativeDriver: true
    }).start(callBack);
  }

  beginRefresh() {
    this._beginReboundToRefresh();
  }

  endRefresh() {
    this._beginEndRefreshRebound();
  }

  beginLoading() {
    this._beginReboundLoading();
  }

  endLoading(rebound: boolean = false) {
    if (rebound) this._beginEndLoadingRebound();
    else {
      this._enoughLoadMore = false;
      this._cancelLoadMore = false;
      idx(() => this._loadingFooter.changeToState("waiting"));
    }
  }
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
  initOffset?: Offset,
  onScroll?: (offset: Offset) => any,
  showsVerticalScrollIndicator?: boolean,
  decelerationRate?: number,
  decelerationRateWhenOut?: number,
  dampingCoefficient?: number,
  reboundEasing?: (value: number) => number,
  reboundDuration?: number,
  getNativeOffset?: (offset: AnimatedWithChildren) => any,

  textInputRefs?: any[],
  tapToHideKeyboard?: boolean,
  inputToolBarHeight?: number,

  refreshHeaderHeight?: number,
  refreshHeader?: RefreshHeader,
  onRefresh?: () => any,
  onCancelRefresh?: () => any,

  loadingFooterHeight?: number,
  loadingFooter?: LoadingFooter,
  onLoading?: () => any,
  onCancelLoading?: () => any,
  allLoaded?: boolean,

  onTouchBegin?: () => any,
  onTouchEnd?: () => any,
  onMomentumScrollStart?: () => any,
  onMomentumScrollEnd?: () => any,

  indicatorDismissTimeInterval?: number

  //键盘处理
  // onContentLayoutChange?: (layout: Frame) => any,
  // renderIndicator?: () => React.Element<any>,
}
