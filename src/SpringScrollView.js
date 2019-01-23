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
      this._offsetY = new Animated.Value(props.initialContentOffset.y);
    }
    this._event = Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              y: this._offsetY,
              ...props.scrollEventExtract
            }
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
          scrollEventThrottle={16}
        >
          <SpringScrollContentViewNative
            style={this.props.contentStyle}
            collapsable={false}
            onLayout={this._onContentLayoutChange}
          >
            {children}
          </SpringScrollContentViewNative>
          {Platform.OS === "android" && this.renderExternal()}
        </SpringScrollViewNative>
        {Platform.OS === "ios" && this.renderExternal()}
      </View>
    );
  }

  renderExternal() {
    const {
      refreshHeaderHeight,
      loadingFooterHeight,
      onRefresh,
      onLoading,
      refreshHeader: Refresh,
      loadingFooter: Footer,
      showsVerticalScrollIndicator
    } = this.props;
    const measured =
      this._height !== undefined && this._contentHeight !== undefined;
    if (!measured) return null;
    return [
      onRefresh &&
        <Animated.View style={this._getRefreshHeaderStyle()} key={"refresh"}>
          <Refresh
            ref={ref => (this._refreshHeader = ref)}
            offset={this._offsetY}
            maxHeight={refreshHeaderHeight}
          />
        </Animated.View>,

      onLoading &&
        <Animated.View style={this._getLoadingFooterStyle()} key={"loading"}>
          <Footer
            ref={ref => (this._loadingFooter = ref)}
            offset={this._offsetY}
            maxHeight={loadingFooterHeight}
            bottomOffset={this._contentHeight - this._height}
          />
        </Animated.View>,

      showsVerticalScrollIndicator &&
        <Animated.View style={this._getIndicatorStyle()} key={"indicator"} />
    ];
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
      setTimeout(resolve, 550);
    });
  }

  scroll(offset: Offset, animated: boolean = true) {
    console.log("scroll=====>", JSON.stringify(offset));
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
    console.log("CCscrollView endLoading");
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

  _onLoading = () => {
    if (this._loadingStatus === "draggingEnough") {
      this._toLoadingStatus("loading");
      this.props.onLoading && this.props.onLoading();
    }
  };

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

  _onWrapperLayoutChange = ({
    nativeEvent: { layout: { x, y, width, height } }
  }) => {
    if (this._height !== height) {
      this._height = height;
      if (!this._contentHeight) return;
      if (this._offsetYValue > this._contentHeight - this._height)
        this.scrollToEnd();
      this.forceUpdate();
    }
  };

  _onContentLayoutChange = ({
    nativeEvent: { layout: { x, y, width, height } }
  }) => {
    if (this._contentHeight !== height) {
      this._contentHeight = height;
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
    initialContentOffset: { x: 0, y: 0 }
  };
}

interface ScrollEventProps {
  offsetY?: Animated.Value
}

interface PropType extends ViewProps {
  style?: ViewStyle,
  contentStyle?: ViewStyle,
  bounces?: boolean,
  scrollEnabled?: boolean,
  initialContentOffset?: Offset,
  showsVerticalScrollIndicator?: boolean,
  showsHorizontalScrollIndicator?: boolean,
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
  requireNativeComponent("SpringScrollView", SpringScrollView)
);

const SpringScrollContentViewNative =
  Platform.OS === "ios"
    ? requireNativeComponent("SpringScrollContentView")
    : View;
