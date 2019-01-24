/**
 * Author: Shi(bolan0000@icloud.com)
 * Date: 2019/1/17
 * Copyright (c) 2018, AoTang, Inc.
 *
 * Description:
 */

import * as React from "react";
import {
  Animated,
  requireNativeComponent,
  View,
  findNodeHandle,
  UIManager,
  Keyboard,
  Platform,
  NativeModules,
  ViewProps,
  ViewStyle
} from "react-native";
import * as TextInputState from "react-native/lib/TextInputState";
import { FooterStatus } from "./LoadingFooter";
import { NormalHeader } from "./NormalHeader";
import { NormalFooter } from "./NormalFooter";
import type { HeaderStatus } from "./RefreshHeader";
import { idx } from "./idx";
import type { Offset, SpringScrollViewPropType } from "./Types";

export class SpringScrollView extends React.PureComponent<
  SpringScrollViewPropType
> {
  _offsetY: Animated.Value;
  _offsetX: Animated.Value;
  _offsetYValue: number = 0;
  _event;
  _keyboardHeight: number;
  _refreshHeader;
  _loadingFooter;
  _width: number;
  _height: number;
  _scrollView: View;
  _indicatorOpacity: Animated.Value = new Animated.Value(1);
  _contentHeight: number;
  _contentWidth: number;
  _refreshStatus: HeaderStatus = "waiting";
  _loadingStatus: FooterStatus = "waiting";
  _indicatorAnimation;
  _nativeOffset;

  constructor(props: SpringScrollViewPropType) {
    super(props);
    this.obtainScrollEvent(props);
  }

  componentWillReceiveProps(nextProps: SpringScrollViewPropType) {
    if (
      nextProps.onNativeContentOffsetExtract !==
      this.props.onNativeContentOffsetExtract
    ) {
      this.obtainScrollEvent(nextProps);
    }
  }

  obtainScrollEvent(props: SpringScrollViewPropType) {
    if (!props) props = {};
    this._nativeOffset = {
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      ...props.onNativeContentOffsetExtract
    };
    this._offsetY = this._nativeOffset.y;
    this._offsetX = this._nativeOffset.x;
    this._event = Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: this._nativeOffset
          }
        }
      ],
      {
        useNativeDriver: true,
        listener: this._onScroll
      }
    );
  }

  render() {
    const {
      style,
      children,
      refreshHeaderHeight,
      loadingFooterHeight,
      onRefresh,
      onLoading
    } = this.props;
    return (
      <View {...this.props} style={[{ flex: 1 }, style]}>
        <SpringScrollViewNative
          {...this.props}
          ref={ref => (this._scrollView = ref)}
          style={[{ flex: 1 }, style]}
          onScroll={this._event}
          refreshHeaderHeight={onRefresh ? refreshHeaderHeight : 0}
          loadingFooterHeight={onLoading ? loadingFooterHeight : 0}
          keyboardShouldPersistTaps={"never"}
          onLayout={this._onWrapperLayoutChange}
          onTouchBegin={this._onTouchBegin}
          onTouchStart={this._onTouchBegin}
          onMomentumScrollEnd={this._onMomentumScrollEnd}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={1}
          onNativeContentOffsetExtract={this._nativeOffset}
        >
          <SpringScrollContentViewNative
            style={this.props.contentStyle}
            collapsable={false}
            onLayout={this._onContentLayoutChange}
          >
            {this._renderRefreshHeader()}
            {this._renderLoadingFooter()}
            {children}
          </SpringScrollContentViewNative>
        </SpringScrollViewNative>
        {this._renderHorizontalIndicator()}
        {this._renderVerticalIndicator()}
      </View>
    );
  }

  _renderRefreshHeader() {
    const {
      refreshHeaderHeight,
      onRefresh,
      refreshHeader: Refresh
    } = this.props;
    const measured =
      this._height !== undefined && this._contentHeight !== undefined;
    if (!measured) return null;
    return (
      onRefresh &&
      <Animated.View style={this._getRefreshHeaderStyle()}>
        <Refresh
          ref={ref => (this._refreshHeader = ref)}
          offset={this._offsetY}
          maxHeight={refreshHeaderHeight}
        />
      </Animated.View>
    );
  }

  _renderLoadingFooter() {
    const {
      loadingFooterHeight,
      onLoading,
      loadingFooter: Footer
    } = this.props;
    const measured =
      this._height !== undefined && this._contentHeight !== undefined;
    if (!measured) return null;
    return (
      onLoading &&
      <Animated.View style={this._getLoadingFooterStyle()}>
        <Footer
          ref={ref => (this._loadingFooter = ref)}
          offset={this._offsetY}
          maxHeight={loadingFooterHeight}
          bottomOffset={this._contentHeight - this._height}
        />
      </Animated.View>
    );
  }

  _renderVerticalIndicator() {
    const { showsVerticalScrollIndicator } = this.props;
    const measured =
      this._height !== undefined && this._contentHeight !== undefined;
    if (!measured) return null;
    return (
      showsVerticalScrollIndicator &&
      <Animated.View style={this._getVerticalIndicatorStyle()} />
    );
  }

  _renderHorizontalIndicator() {
    const { showsHorizontalScrollIndicator } = this.props;
    const measured =
      this._height !== undefined && this._contentHeight !== undefined;
    if (!measured) return null;
    return (
      showsHorizontalScrollIndicator &&
      this._contentWidth > this._width &&
      <Animated.View style={this._getHorizontalIndicatorStyle()} />
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

  scrollTo(offset: Offset, animated: boolean = true) {
    console.log("scrollTo=====>", JSON.stringify(offset));
    if (Platform.OS === "ios") {
      NativeModules.SpringScrollView.scrollTo(
        findNodeHandle(this._scrollView),
        offset.x,
        offset.y,
        animated
      );
    } else if (Platform.OS === "android") {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._scrollView),
        10002,
        [offset.x, offset.y, animated]
      );
    }
    return new Promise((resolve, reject) => {
      if (animated) setTimeout(resolve, 500);
      else resolve();
    });
  }

  scroll(offset: Offset, animated: boolean = true) {
    return this.scrollTo(
      { x: offset.x, y: offset.y + this._offsetYValue },
      animated
    );
  }

  scrollToTop(animated: boolean) {
    return this.scrollTo({ x: 0, y: 0 }, animated);
  }

  scrollToEnd(animated: boolean = true) {
    let toOffsetY = this._contentHeight - this._height;
    if (toOffsetY < 0) toOffsetY = 0;
    return this.scrollTo({ x: 0, y: toOffsetY }, animated);
  }

  endRefresh() {
    if (Platform.OS === "ios") {
      NativeModules.SpringScrollView.endRefresh(
        findNodeHandle(this._scrollView)
      );
    } else if (Platform.OS === "android") {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._scrollView),
        10000,
        []
      );
    }
  }

  endLoading() {
    if (Platform.OS === "ios") {
      NativeModules.SpringScrollView.endLoading(
        findNodeHandle(this._scrollView)
      );
    } else if (Platform.OS === "android") {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._scrollView),
        10001,
        []
      );
    }
  }

  _onKeyboardWillShow = evt => {
    this.props.textInputRefs.every(input => {
      if (idx(() => input.current.isFocused())) {
        input.current.measure((x, y, w, h, l, t) => {
          this._keyboardHeight =
            t + h - evt.endCoordinates.screenY + this.props.inputToolBarHeight;
          this._keyboardHeight > 0 &&
            this.scroll({ x: 0, y: this._keyboardHeight });
        });
        return false;
      }
      return true;
    });
  };

  _onKeyboardWillHide = () => {
    this._keyboardHeight > 0 && this.scroll({ x: 0, y: -this._keyboardHeight });
  };

  _beginIndicatorDismissAnimation() {
    this._indicatorOpacity.setValue(1);
    this._indicatorAnimation && this._indicatorAnimation.stop();
    this._indicatorAnimation = Animated.timing(this._indicatorOpacity, {
      toValue: 0,
      delay: 1000,
      duration: 1000,
      useNativeDriver: true
    });
    this._indicatorAnimation.start(({ finished }) => {
      if (!finished) {
        this._indicatorOpacity.setValue(1);
      }
    });
  }

  _onScroll = e => {
    const {
      contentOffset: { x, y },
      refreshStatus,
      loadingStatus
    } = e.nativeEvent;
    this._offsetYValue = y;
    if (this._refreshStatus !== refreshStatus) {
      this._toRefreshStatus(refreshStatus);
      this.props.onRefresh &&
        refreshStatus === "refreshing" &&
        this.props.onRefresh();
    }
    if (this._loadingStatus !== loadingStatus) {
      this._toLoadingStatus(loadingStatus);
      this.props.onLoading &&
        loadingStatus === "loading" &&
        this.props.onLoading();
    }
    this.props.onScroll && this.props.onScroll(e);
  };

  _toRefreshStatus(status: HeaderStatus) {
    this._refreshStatus = status;
    this._refreshHeader.changeToState(status);
  }

  _toLoadingStatus(status: FooterStatus) {
    this._loadingStatus = status;
    this._loadingFooter.changeToState(status);
  }

  _getVerticalIndicatorStyle() {
    const indicatorHeight = this._height / this._contentHeight * this._height;
    return {
      position: "absolute",
      top: 0,
      right: 2,
      height: indicatorHeight,
      width: 3,
      borderRadius: 3,
      opacity: this._indicatorOpacity,
      backgroundColor: "#A8A8A8",
      transform: [
        {
          translateY: Animated.multiply(
            this._offsetY,
            this._height / this._contentHeight
          )
        }
      ]
    };
  }

  _getHorizontalIndicatorStyle() {
    const indicatorWidth = this._width / this._contentWidth * this._width;
    return {
      position: "absolute",
      bottom: 2,
      left: 0,
      height: 3,
      width: indicatorWidth,
      borderRadius: 3,
      opacity: this._indicatorOpacity,
      backgroundColor: "#A8A8A8",
      transform: [
        {
          translateX: Animated.multiply(
            this._offsetX,
            this._width / this._contentWidth
          )
        }
      ]
    };
  }

  _getRefreshHeaderStyle() {
    const rHeight = this.props.refreshHeaderHeight;
    const { refreshStyle } = this.props;
    let transform;
    if (refreshStyle === "topping") {
      transform = [
        {
          translateY: this._offsetY.interpolate({
            inputRange: [-rHeight - 1, -rHeight, 0, 1],
            outputRange: [-1, 0, rHeight, rHeight]
          })
        }
      ];
    } else if (refreshStyle === "stickyScrollView") {
      transform = [
        {
          translateY: this._offsetY.interpolate({
            inputRange: [-rHeight - 1, -rHeight, 0, 1],
            outputRange: [-1, 0, 0, 0]
          })
        }
      ];
    } else if (refreshStyle !== "stickyContent") {
      console.warn(
        "unsupported value: '",
        refreshStyle,
        "' for refreshStyle in SpringScrollView, " +
          "select one in 'topping','stickyScrollView','stickyContent' please"
      );
    }
    return {
      position: "absolute",
      top: -rHeight,
      right: 0,
      height: rHeight,
      left: 0,
      transform
    };
  }

  _getLoadingFooterStyle() {
    const fHeight = this.props.loadingFooterHeight;
    const maxOffset = this._contentHeight - this._height;
    const { loadingStyle } = this.props;
    let transform;
    if (loadingStyle === "bottoming") {
      transform = [
        {
          translateY: this._offsetY.interpolate({
            inputRange: [
              maxOffset - 1,
              maxOffset,
              maxOffset + fHeight,
              maxOffset + fHeight + 1
            ],
            outputRange: [-fHeight, -fHeight, 0, 1]
          })
        }
      ];
    } else if (loadingStyle === "stickyScrollView") {
      transform = [
        {
          translateY: this._offsetY.interpolate({
            inputRange: [
              maxOffset - 1,
              maxOffset,
              maxOffset + fHeight,
              maxOffset + fHeight + 1
            ],
            outputRange: [0, 0, 0, 1]
          })
        }
      ];
    } else if (loadingStyle !== "stickyContent") {
      console.warn(
        "unsupported value: '",
        loadingStyle,
        "' for loadingStyle in SpringScrollView, " +
          "select one in 'bottoming','stickyScrollView','stickyContent' please"
      );
    }
    return {
      position: "absolute",
      right: 0,
      bottom: -fHeight,
      height: fHeight,
      left: 0,
      transform
    };
  }

  _onWrapperLayoutChange = ({
    nativeEvent: { layout: { x, y, width, height } }
  }) => {
    if (this._height !== height || this._width !== width) {
      this._height = height;
      this._width = width;
      if (!this._contentHeight) return;
      if (this._offsetYValue > this._contentHeight - this._height)
        this.scrollToEnd();
      this.forceUpdate();
    }
  };

  _onContentLayoutChange = ({
    nativeEvent: { layout: { x, y, width, height } }
  }) => {
    if (this._contentHeight !== height || this._contentWidth !== width) {
      this._contentHeight = height;
      this._contentWidth = width;
      if (!this._height) return;
      if (this._offsetYValue > this._contentHeight - this._height)
        this.scrollToEnd();
      this.forceUpdate();
    }
  };

  _onTouchBegin = () => {
    if (TextInputState.currentlyFocusedField())
      TextInputState.blurTextInput(TextInputState.currentlyFocusedField());
    this._indicatorAnimation && this._indicatorAnimation.stop();
    this._indicatorOpacity.setValue(1);
    this.props.tapToHideKeyboard && Keyboard.dismiss();
    this.props.onTouchBegin && this.props.onTouchBegin();
  };

  _onMomentumScrollEnd = () => {
    this._beginIndicatorDismissAnimation();
    this.props.onMomentumScrollEnd && this.props.onMomentumScrollEnd();
  };

  static defaultProps = {
    bounces: true,
    scrollEnabled: true,
    refreshHeaderHeight: 100,
    loadingFooterHeight: 100,
    refreshHeader: NormalHeader,
    loadingFooter: NormalFooter,
    textInputRefs: [],
    inputToolBarHeight: 44,
    tapToHideKeyboard: true,
    initOffset: { x: 0, y: 0 },
    showsVerticalScrollIndicator: true,
    showsHorizontalScrollIndicator: true,
    initialContentOffset: { x: 0, y: 0 },
    onNativeContentOffsetExtract: {
      x: new Animated.Value(0),
      y: new Animated.Value(0)
    },
    refreshStyle: "stickyContent",
    loadingStyle: "stickyContent"
  };
}

const SpringScrollViewNative = Animated.createAnimatedComponent(
  requireNativeComponent("SpringScrollView", SpringScrollView)
);

const SpringScrollContentViewNative =
  Platform.OS === "ios"
    ? requireNativeComponent("SpringScrollContentView")
    : View;
