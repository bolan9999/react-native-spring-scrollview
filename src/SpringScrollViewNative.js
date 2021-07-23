/*
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2021-07-15 17:11:44
 * @LastEditTime: 2021-07-23 10:40:09
 * @LastEditors: 石破天惊
 * @Description:
 */
/**
 * Author: Shi(bolan0000@icloud.com)
 * Date: 2019/1/17
 * Copyright (c) 2018, AoTang, Inc.
 *
 * Description: 将安卓导出的事件于iOS打平,消除安卓端因为原生自带的事件的影响
 */

import React from "react";
import { Animated, Platform, requireNativeComponent, View } from "react-native";

const SpringScrollViewNative = Animated.createAnimatedComponent(
  requireNativeComponent("SpringScrollView")
);

export class SpringScrollViewNativeAdapter extends React.Component {
  _scrollViewRef;
  render() {
    return (
      <SpringScrollViewNative
        {...this.props}
        pagingEnabled={Platform.select({
          ios: false,
          android: this.props.pagingEnabled,
        })}
        pagingEnabledB={this.props.pagingEnabled}
        decelerationRate={
          this.props.pagingEnabled ? 0.99 : this.props.decelerationRate
        }
        ref={(ref) => (this._scrollViewRef = ref)}
        onTouchStart={(e) =>
          Platform.OS === "ios" &&
          this.props.onTouchBegin &&
          this.props.onTouchBegin(e)
        }
        onCustomTouchBegin={(e) =>
          this.props.onTouchBegin && this.props.onTouchBegin(e)
        }
        onTouchEnd={Platform.select({
          ios: this.props.onTouchEnd,
          android: null,
        })}
        onCustomTouchEnd={(e) =>
          this.props.onTouchEnd && this.props.onTouchEnd(e)
        }
        onCustomMomentumScrollBegin={(e) =>
          this.props.onMomentumScrollBegin &&
          this.props.onMomentumScrollBegin(e)
        }
        onCustomMomentumScrollEnd={(e) =>
          this.props.onMomentumScrollEnd && this.props.onMomentumScrollEnd(e)
        }
        onCustomScrollBeginDrag={(e) =>
          this.props.onScrollBeginDrag && this.props.onScrollBeginDrag(e)
        }
        onCustomScrollEndDrag={(e) =>
          this.props.onScrollEndDrag && this.props.onScrollEndDrag(e)
        }
      />
    );
  }

  attachScrollNativeEvent(offset) {
    return Animated.attachNativeEvent(this._scrollViewRef, "onScroll", [
      {
        nativeEvent: {
          contentOffset: offset,
        },
      },
    ]);
  }
}

export const SpringScrollContentViewNative =
  Platform.OS === "ios"
    ? requireNativeComponent("SpringScrollContentView")
    : View;
