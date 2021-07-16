/**
 * Author: Shi(bolan0000@icloud.com)
 * Date: 2019/1/17
 * Copyright (c) 2018, AoTang, Inc.
 *
 * Description: 将安卓导出的事件于iOS打平,消除安卓端因为原生自带的事件的影响
 */

import React from 'react';
import {Animated, Platform, requireNativeComponent, View} from 'react-native';

const SpringScrollViewNative = Animated.createAnimatedComponent(
  requireNativeComponent('SpringScrollView'),
);

export class SpringScrollViewNativeAdapter extends React.Component {
  _scrollViewRef;
  render() {
    return (
      <SpringScrollViewNative
        {...this.props}
        ref={(ref) => (this._scrollViewRef = ref)}
        onTouchStart={(e) =>
          Platform.OS === 'ios' &&
          this.props.onTouchBegin &&
          this.props.onTouchBegin(e)
        }
        onCustomTouchBegin={(e) =>
          this.props.onTouchBegin && this.props.onTouchBegin(e)
        }
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
    return Animated.attachNativeEvent(
      this._scrollViewRef,
      'onScroll',
      [
        {
          nativeEvent: {
            contentOffset: offset,
          },
        },
      ],
    );
  }
}

export const SpringScrollContentViewNative =
  Platform.OS === 'ios'
    ? requireNativeComponent('SpringScrollContentView')
    : View;
