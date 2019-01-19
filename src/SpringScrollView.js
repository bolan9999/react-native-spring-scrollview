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
  ViewProps,
  ViewStyle
} from "react-native";
import { RefreshHeader } from "./RefreshHeader";
import { FooterStatus, LoadingFooter } from "./LoadingFooter";
import { NormalHeader } from "./NormalHeader";
import { NormalFooter } from "./NormalFooter";
import type { HeaderStatus } from "./RefreshHeader";
import { idx } from "./idx";
import type { Offset } from "./Types";

export class SpringScrollView extends React.PureComponent<PropType> {
  _offsetY: Animated.Value;
  _offsetYValue: number = 0;
  _event;
  _keyboardHeight: number;
  _refreshHeader;
  _loadingFooter;
  _height: number;
  _scrollView: View;
  _indicatorOpacity: Animated.Value = new Animated.Value(1);
  _contentHeight: number;
  _refreshStatus: HeaderStatus = "waiting";
  _loadingStatus: FooterStatus = "waiting";
  _indicatorAnimation;

  constructor(props: PropType) {
    super(props);
    this.obtainScrollEvent(props);
  }

  componentWillReceiveProps(nextProps: PropType) {
    if (nextProps.scrollEventExtract !== this.props.scrollEventExtract) {
      this.obtainScrollEvent(nextProps);
    }
  }

  obtainScrollEvent(props: PropType) {
    if (!props) props = {};
    if (props.scrollEventExtract && props.scrollEventExtract.offsetY) {
      this._offsetY = props.scrollEventExtract.offsetY;
    } else {
      this._offsetY = new Animated.Value(0);
    }
    this._event = Animated.event(
      [
        {
          nativeEvent: {
            offsetY: this._offsetY,
            ...props.scrollEventExtract
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
      children,
      refreshHeaderHeight,
      loadingFooterHeight,
      onRefresh,
      onLoading,
      refreshHeader: Refresh,
      loadingFooter: Footer
    } = this.props;
    const measured =
      this._height !== undefined && this._contentHeight !== undefined;
    return (
      <SpringScrollViewNative
        {...this.props}
        ref={ref => (this._scrollView = ref)}
        onScroll={this._event}
        refreshHeaderHeight={onRefresh ? refreshHeaderHeight : 0}
        loadingFooterHeight={onLoading ? loadingFooterHeight : 0}
        onRefresh={this._onRefresh}
        onLoading={this._onLoading}
        onLayoutChange={this._onLayout}
        onTouchBegin={this._onTouchBegin}
        onMomentumScrollEnd={this._onMomentumScrollEnd}
      >
        <View style={this.props.contentStyle} collapsable={false}>
          {children}
        </View>
        {measured &&
          onRefresh &&
          <Animated.View style={this._getRefreshHeaderStyle()}>
            <Refresh
              ref={ref => (this._refreshHeader = ref)}
              offset={this._offsetY}
              maxHeight={refreshHeaderHeight}
            />
          </Animated.View>}
        {measured &&
          onLoading &&
          <Animated.View style={this._getLoadingFooterStyle()}>
            <Footer
              ref={ref => (this._loadingFooter = ref)}
              offset={this._offsetY}
              maxHeight={loadingFooterHeight}
              bottomOffset={this._contentHeight - this._height}
            />
          </Animated.View>}
        {measured && <Animated.View style={this._getIndicatorStyle()} />}
      </SpringScrollViewNative>
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
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this._scrollView),
      10002,
      [offset.x, offset.y, animated]
    );
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 550);
    });
  }

  scroll(offset: Offset, animated: boolean = true) {
    return this.scrollTo(
      { x: offset.x, y: offset.y + this._offsetYValue },
      animated
    );
  }

  scrollToBegin(animated: boolean) {
    return this.scrollTo({ x: 0, y: 0 }, animated);
  }

  scrollToEnd(animated: boolean = true) {
    return this.scrollTo(
      { x: 0, y: this._contentHeight - this._height },
      animated
    );
  }

  endRefresh() {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this._scrollView),
      10000,
      []
    );
  }

  endLoading() {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this._scrollView),
      10001,
      []
    );
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

  _onRefresh = () => {
    if (this._refreshStatus === "pullingEnough") {
      this._toRefreshStatus("refreshing");
      this.props.onRefresh && this.props.onRefresh();
    }
  };

  _onLoading = () => {
    if (this._loadingStatus === "draggingEnough") {
      this._toLoadingStatus("loading");
      this.props.onLoading && this.props.onLoading();
    }
  };

  _onScroll = e => {
    const { offsetY } = e.nativeEvent;
    this._offsetYValue = offsetY;
    const rHeight = this.props.refreshHeaderHeight;
    const lHeight = this.props.loadingFooterHeight;
    const maxOffset = this._contentHeight - this._height;
    if (this.props.onRefresh) {
      if (offsetY < 0 && offsetY > -rHeight) {
        if (this._refreshStatus === "waiting") this._toRefreshStatus("pulling");
        if (this._refreshStatus === "refreshing")
          this._toRefreshStatus("rebound");
      }
      if (offsetY < -rHeight && this._refreshStatus === "pulling") {
        this._toRefreshStatus("pullingEnough");
      }
      if (offsetY >= 0) {
        this._toRefreshStatus("waiting");
      }
    }

    if (this.props.onLoading) {
      if (offsetY > maxOffset && offsetY < maxOffset + lHeight) {
        if (this._loadingStatus === "waiting")
          this._toLoadingStatus("dragging");
        if (this._loadingStatus === "loading") this._toLoadingStatus("rebound");
      }
      if (offsetY >= maxOffset + lHeight && this._loadingStatus === "dragging")
        this._toLoadingStatus("draggingEnough");
      if (offsetY <= maxOffset) this._toLoadingStatus("waiting");
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

  _getIndicatorStyle() {
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

  _getRefreshHeaderStyle() {
    const rHeight = this.props.refreshHeaderHeight;
    return {
      position: "absolute",
      top: -rHeight,
      right: 0,
      height: rHeight,
      left: 0,
      transform: [
        {
          translateY: this._offsetY.interpolate({
            inputRange: [-rHeight - 1, -rHeight, 0, 1],
            outputRange: [rHeight, rHeight, 0, 0]
          })
        }
      ]
    };
  }

  _getLoadingFooterStyle() {
    const fHeight = this.props.loadingFooterHeight;
    const maxOffset = this._contentHeight - this._height;
    return {
      position: "absolute",
      right: 0,
      bottom: -fHeight,
      height: fHeight,
      left: 0,
      transform: [
        {
          translateY: this._offsetY.interpolate({
            inputRange: [
              maxOffset - 1,
              maxOffset,
              maxOffset + fHeight,
              maxOffset + fHeight + 1
            ],
            outputRange: [0, 0, -fHeight, -fHeight]
          })
        }
      ]
    };
  }

  _onLayout = ({ nativeEvent: { height, contentHeight } }) => {
    if (this._height !== height || this._contentHeight !== contentHeight) {
      this._height = height;
      this._contentHeight = contentHeight;
      if (this._offsetYValue > contentHeight - height) this.scrollToEnd();
      const { onLayoutChange } = this.props;
      if (!(onLayoutChange && onLayoutChange({ height, contentHeight }))) {
        this.forceUpdate();
      }
    }
  };

  _onTouchBegin = () => {
    this._indicatorAnimation && this._indicatorAnimation.stop();
    this._indicatorOpacity.setValue(1);
    this.props.tapToHideKeyboard && Keyboard.dismiss();
  };

  _onMomentumScrollEnd = () => {
    this._beginIndicatorDismissAnimation();
  };

  static defaultProps = {
    refreshHeaderHeight: 60,
    loadingFooterHeight: 60,
    refreshHeader: NormalHeader,
    loadingFooter: NormalFooter,
    textInputRefs: [],
    inputToolBarHeight: 44,
    tapToHideKeyboard: true
  };
}

interface ScrollEventProps {
  offsetY?: Animated.Value
}


interface PropType extends ViewProps {
  style?: ViewStyle,
  contentStyle?: ViewStyle,
  bounces?: boolean,
  onLayoutChange?: (layout: {
    height: number,
    contentHeight: number
  }) => boolean,
  refreshHeaderHeight?: number,
  loadingFooterHeight?: number,
  refreshHeader?: RefreshHeader,
  loadingFooter?: LoadingFooter,
  onRefresh?: () => any,
  onLoading?: () => any,
  scrollEventExtract?: ScrollEventProps,
  textInputRefs?: any[],
  inputToolBarHeight?: number,
  tapToHideKeyboard?: boolean,
  onTouchBegin?: () => any,
  onTouchEnd?: () => any,
  onMomentumScrollBegin?: () => any,
  onMomentumScrollEnd?: () => any
}

const SpringScrollViewNative = Animated.createAnimatedComponent(
  requireNativeComponent("SpringScrollView")
);
