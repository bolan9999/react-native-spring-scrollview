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
  StyleSheet,
  ViewProps,
  ViewStyle,
  ScrollView,
} from "react-native";
import {
  SpringScrollViewNativeAdapter,
  SpringScrollContentViewNative,
} from "./SpringScrollViewNative";
import { FooterStatus } from "./LoadingFooter";
import { NormalHeader } from "./NormalHeader";
import { NormalFooter } from "./NormalFooter";
import type { HeaderStatus } from "./RefreshHeader";
import { idx } from "./idx";
import type { Offset, SpringScrollViewPropType } from "./Types";
import { styles } from "./styles";

export class SpringScrollView extends React.PureComponent<SpringScrollViewPropType> {
  _contentOffset: Offset = { x: 0, y: 0 };
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
  _scrollEventAttachment;
  _nativeOffset;
  _touching = false;
  _sizeChangeInterval = 0;

  constructor(props) {
    super(props);
    this._nativeOffset = {
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      ...props.onNativeContentOffsetExtract,
    };
    this._nativeOffset.x.setValue(props.initialContentOffset.y);
    this._nativeOffset.y.setValue(props.initialContentOffset.y);
  }

  render() {
    const {
      style,
      inverted,
      children,
      onRefresh,
      onLoading,
      refreshHeader: Refresh,
      loadingFooter: Loading,
    } = this.props;
    const wStyle = StyleSheet.flatten([
      styles.wrapperStyle,
      style,
      { transform: inverted ? [{ scaleY: -1 }] : [] },
    ]);
    const contentStyle = StyleSheet.flatten([
      styles.contentStyle,
      this.props.contentStyle,
    ]);
    return (
      <SpringScrollViewNativeAdapter
        {...this.props}
        ref={(ref) => (this._scrollView = ref)}
        style={wStyle}
        onScroll={this._onScroll}
        refreshHeaderHeight={onRefresh ? Refresh.height : 0}
        loadingFooterHeight={onLoading ? Loading.height : 0}
        onLayout={this._onWrapperLayoutChange}
        onTouchBegin={this._onTouchBegin}
        onScrollBeginDrag={this._onScrollBeginDrag}
        onMomentumScrollEnd={this._onMomentumScrollEnd}
        scrollEventThrottle={1}
      >
        <SpringScrollContentViewNative
          style={contentStyle}
          collapsable={false}
          onLayout={this._onContentLayoutChange}
        >
          {this._renderRefreshHeader()}
          {this._renderLoadingFooter()}
          {children}
        </SpringScrollContentViewNative>
        {this._renderHorizontalIndicator()}
        {this._renderVerticalIndicator()}
      </SpringScrollViewNativeAdapter>
    );
  }

  _renderRefreshHeader() {
    const { onRefresh, refreshHeader: Refresh } = this.props;
    const measured =
      this._height !== undefined && this._contentHeight !== undefined;
    if (!measured) return null;
    return (
      onRefresh && (
        <Animated.View style={this._getRefreshHeaderStyle()}>
          <Refresh
            ref={(ref) => (this._refreshHeader = ref)}
            offset={this._nativeOffset.y}
            maxHeight={Refresh.height}
          />
        </Animated.View>
      )
    );
  }

  _renderLoadingFooter() {
    const { onLoading, loadingFooter: Footer } = this.props;
    const measured =
      this._height !== undefined && this._contentHeight !== undefined;
    if (!measured) return null;
    return (
      onLoading && (
        <Animated.View style={this._getLoadingFooterStyle()}>
          <Footer
            ref={(ref) => (this._loadingFooter = ref)}
            offset={this._nativeOffset.y}
            maxHeight={Footer.height}
            bottomOffset={this._contentHeight - this._height}
          />
        </Animated.View>
      )
    );
  }

  _renderVerticalIndicator() {
    if (Platform.OS === "ios") return null;
    const { showsVerticalScrollIndicator } = this.props;
    const measured =
      this._height !== undefined && this._contentHeight !== undefined;
    if (!measured) return null;
    return (
      showsVerticalScrollIndicator &&
      this._contentHeight > this._height && (
        <Animated.View style={this._getVerticalIndicatorStyle()} />
      )
    );
  }

  _renderHorizontalIndicator() {
    if (Platform.OS === "ios") return null;
    const { showsHorizontalScrollIndicator } = this.props;
    const measured =
      this._height !== undefined && this._contentHeight !== undefined;
    if (!measured) return null;
    return (
      showsHorizontalScrollIndicator &&
      this._contentWidth > this._width && (
        <Animated.View style={this._getHorizontalIndicatorStyle()} />
      )
    );
  }

  componentDidMount() {
    this._scrollEventAttachment = this._scrollView.attachScrollNativeEvent(
      this._nativeOffset
    );
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
    if (this._scrollEventAttachment) this._scrollEventAttachment.detach();
    this._scrollEventAttachment = this._scrollView.attachScrollNativeEvent(
      this._nativeOffset
    );
    this._beginIndicatorDismissAnimation();
  }

  componentWillUnmount() {
    this._scrollEventAttachment && this._scrollEventAttachment.detach();
    this._keyboardShowSub.remove();
    this._keyboardHideSub.remove();
  }

  scrollTo(offset: Offset, animated: boolean = true) {
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
        "10002",
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
      {
        x: offset.x + this._contentOffset.x,
        y: offset.y + this._contentOffset.y,
      },
      animated
    );
  }

  scrollToBegin(animated: boolean) {
    return this.scrollTo({ x: this._contentOffset.x, y: 0 }, animated);
  }

  scrollToEnd(animated: boolean = true) {
    let toOffsetY = this._contentHeight - this._height;
    if (toOffsetY < 0) toOffsetY = 0;
    return this.scrollTo({ x: this._contentOffset.x, y: toOffsetY }, animated);
  }

  beginRefresh() {
    if (!this.props.loadingFooter || this.props.loadingFooter.height <= 0)
      return Promise.reject(
        "SpringScrollView: call beginRefresh without loadingFooter or loadingFooter height"
      );
    return this.scrollTo({
      x: this._contentOffset.x,
      y: -this.props.loadingFooter.height - 1,
    });
  }

  endRefresh() {
    if (Platform.OS === "ios") {
      NativeModules.SpringScrollView.endRefresh(
        findNodeHandle(this._scrollView)
      );
    } else if (Platform.OS === "android") {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._scrollView),
        "10000",
        []
      );
    }
  }

  endLoading(rebound: boolean = false) {
    if (Platform.OS === "ios") {
      NativeModules.SpringScrollView.endLoading(
        findNodeHandle(this._scrollView),
        rebound
      );
    } else if (Platform.OS === "android") {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._scrollView),
        "10001",
        [rebound]
      );
    }
  }

  _onKeyboardWillShow = (evt) => {
    this._touching = false;
    this.props.textInputRefs.every((input) => {
      if (idx(() => input.current.isFocused())) {
        input.current.measureInWindow((x, y, w, h, l, t) => {
          this._keyboardHeight =
            -evt.endCoordinates.screenY + this.props.inputToolBarHeight + y + h;
          this._keyboardHeight > 0 &&
            this.scroll({ x: 0, y: this._keyboardHeight });
        });
        return false;
      }
      return true;
    });
  };

  _onKeyboardWillHide = () => {
    if (this._keyboardHeight > 0) {
      !this._touching && this.scroll({ x: 0, y: -this._keyboardHeight });
      this._keyboardHeight = 0;
    }
  };

  _beginIndicatorDismissAnimation() {
    this._indicatorOpacity.setValue(1);
    this._indicatorAnimation && this._indicatorAnimation.stop();
    this._indicatorAnimation = Animated.timing(this._indicatorOpacity, {
      toValue: 0,
      delay: 500,
      duration: 500,
      useNativeDriver: true,
    });
    this._indicatorAnimation.start(({ finished }) => {
      if (!finished) {
        this._indicatorOpacity.setValue(1);
      }
      this._indicatorAnimation = null;
    });
  }

  _onScroll = (e) => {
    const {
      contentOffset: { x, y },
      refreshStatus,
      loadingStatus,
    } = e.nativeEvent;
    this._contentOffset = { x, y };
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
    if (!this._indicatorAnimation) {
      this._indicatorOpacity.setValue(1);
    }
  };

  _toRefreshStatus(status: HeaderStatus) {
    this._refreshStatus = status;
    idx(() => this._refreshHeader.changeToState(status));
  }

  _toLoadingStatus(status: FooterStatus) {
    this._loadingStatus = status;
    idx(() => this._loadingFooter.changeToState(status));
  }

  _getVerticalIndicatorStyle() {
    const indicatorHeight = (this._height / this._contentHeight) * this._height;
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
            this._nativeOffset.y,
            this._height / this._contentHeight
          ),
        },
      ],
    };
  }

  _getHorizontalIndicatorStyle() {
    const indicatorWidth = (this._width / this._contentWidth) * this._width;
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
            this._nativeOffset.x,
            this._width / this._contentWidth
          ),
        },
      ],
    };
  }

  _getRefreshHeaderStyle() {
    const rHeight = this.props.refreshHeader.height;
    const style = this.props.refreshHeader.style;
    let transform = [];
    if (style === "topping") {
      transform = [
        {
          translateY: this._nativeOffset.y.interpolate({
            inputRange: [-rHeight - 1, -rHeight, 0, 1],
            outputRange: [-1, 0, rHeight, rHeight],
          }),
        },
      ];
    } else if (style === "stickyScrollView") {
      transform = [
        {
          translateY: this._nativeOffset.y.interpolate({
            inputRange: [-rHeight - 1, -rHeight, 0, 1],
            outputRange: [-1, 0, 0, 0],
          }),
        },
      ];
    } else if (style !== "stickyContent") {
      console.warn(
        "unsupported value: '",
        style,
        "' in SpringScrollView, " +
          "select one in 'topping','stickyScrollView','stickyContent' please"
      );
    }
    if (this.props.inverted) transform.push({ scaleY: -1 });
    return {
      position: "absolute",
      top: -rHeight,
      right: 0,
      height: rHeight,
      left: 0,
      transform,
    };
  }

  _getLoadingFooterStyle() {
    const fHeight = this.props.loadingFooter.height;
    const maxOffset = this._contentHeight - this._height;
    const style = this.props.loadingFooter.style;
    let transform = [];
    if (style === "bottoming") {
      transform = [
        {
          translateY: this._nativeOffset.y.interpolate({
            inputRange: [
              maxOffset - 1,
              maxOffset,
              maxOffset + fHeight,
              maxOffset + fHeight + 1,
            ],
            outputRange: [-fHeight, -fHeight, 0, 1],
          }),
        },
      ];
    } else if (style === "stickyScrollView") {
      transform = [
        {
          translateY: this._nativeOffset.y.interpolate({
            inputRange: [
              maxOffset - 1,
              maxOffset,
              maxOffset + fHeight,
              maxOffset + fHeight + 1,
            ],
            outputRange: [0, 0, 0, 1],
          }),
        },
      ];
    } else if (style !== "stickyContent") {
      console.warn(
        "unsupported value: '",
        style,
        "' in SpringScrollView, " +
          "select one in 'bottoming','stickyScrollView' and 'stickyContent' please!"
      );
    }
    if (this.props.inverted) transform.push({ scaleY: -1 });
    return {
      position: "absolute",
      right: 0,
      top:
        this._height > this._contentHeight ? this._height : this._contentHeight,
      height: fHeight,
      left: 0,
      transform,
    };
  }

  _onWrapperLayoutChange = ({
    nativeEvent: {
      layout: { x, y, width, height },
    },
  }) => {
    if (this._height !== height || this._width !== width) {
      this.props.onSizeChange && this.props.onSizeChange({ width, height });
      this._height = height;
      this._width = width;
      this._startSizeChangeInterval();
    }
  };

  _onContentLayoutChange = ({
    nativeEvent: {
      layout: { x, y, width, height },
    },
  }) => {
    if (this._contentHeight !== height || this._contentWidth !== width) {
      this.props.onContentSizeChange &&
        this.props.onContentSizeChange({ width, height });
      this._contentHeight = height;
      this._contentWidth = width;
      this._startSizeChangeInterval();
    }
  };

  _startSizeChangeInterval = () => {
    if (this._sizeChangeInterval) clearInterval(this._sizeChangeInterval);
    this._sizeChangeInterval = setInterval(() => {
      if (!this._height || !this._contentHeight) return;
      if (this._contentHeight < this._height)
        this._contentHeight = this._height;
      let { x: maxX, y: maxY } = this._contentOffset;
      if (this._contentOffset.y > this._contentHeight - this._height) {
        maxY = this._contentHeight - this._height;
        if (maxY < 0) maxY = 0;
      }
      if (this._contentOffset.x > this._contentWidth - this._width) {
        maxX = this._contentWidth - this._width;
        if (maxX < 0) maxX = 0;
      }
      if (maxX !== this._contentOffset.x || maxY !== this._contentOffset.y) {
        Platform.OS === "android" && this.scrollTo({ x: maxX, y: maxY }, false);
      }
      this.forceUpdate();
      clearInterval(this._sizeChangeInterval);
      this._sizeChangeInterval = 0;
    }, Platform.select({ ios: 10, android: 30 }));
  };

  _onTouchBegin = (e) => {
    this._touching = true;
    this.props.onTouchBegin && this.props.onTouchBegin(e);
  };

  _onMomentumScrollEnd = () => {
    this._touching = false;
    this._beginIndicatorDismissAnimation();
    this.props.onMomentumScrollEnd && this.props.onMomentumScrollEnd();
  };

  _onScrollBeginDrag = () => {
    if (this.props.dragToHideKeyboard) Keyboard.dismiss();
    this.props.onScrollBeginDrag && this.props.onScrollBeginDrag();
  };

  static defaultProps = {
    bounces: true,
    scrollEnabled: true,
    refreshHeader: NormalHeader,
    loadingFooter: NormalFooter,
    textInputRefs: [],
    decelerationRate: 0.997,
    inputToolBarHeight: 44,
    dragToHideKeyboard: true,
    keyboardShouldPersistTaps: "handled",
    showsVerticalScrollIndicator: true,
    showsHorizontalScrollIndicator: true,
    initialContentOffset: { x: 0, y: 0 },
    alwaysBounceVertical: true,
    pagingEnabled: false,
    pageSize: { width: 0, height: 0 },
  };
}
