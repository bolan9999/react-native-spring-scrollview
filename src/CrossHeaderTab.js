/*
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2021-10-18 16:05:14
 * @LastEditTime: 2021-10-19 00:03:02
 * @LastEditors: 石破天惊
 * @Description:
 */

import React from "react";
import { Text, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { SpringScrollView } from "./SpringScrollView";
import Reanimated, {
  useAnimatedGestureHandler,
  useSharedValue,
} from "react-native-reanimated";

interface CrossHeaderTabType extends ViewProps {
  tabCount: number;
  renderHeader: () => React.ReactElement<any>;
  renderTab: (tab: number) => React.ReactElement<any>;
}

export const CrossHeaderTab = React.forwardRef(
  (props: CrossHeaderTabType, ref) => {
    const arr = new Array(props.tabCount).fill(0);
    const currentIndex = useSharedValue(0);
    const [onHeaderPans] = React.useState(
      arr.map(() => ({ onActive: null, onEnd: null }))
    );
    const panHandler = useAnimatedGestureHandler({
      onStart: (evt, ctx) =>
        (ctx.last = { x: evt.absoluteX, y: evt.absoluteY }),
      onActive: (evt, ctx) => {
        if (onHeaderPans[currentIndex.value].onActive) {
          onHeaderPans[currentIndex.value].onActive(evt, ctx);
        }
      },
      onEnd: (evt, ctx) => {
        if (onHeaderPans[currentIndex.value].onEnd) {
          onHeaderPans[currentIndex.value].onEnd(evt, ctx);
        }
      },
    });
    const children = arr.map((_, index) => {
      return React.Children.map(props.renderTab(index), (child, childIndex) => {
        return React.cloneElement(child, {
          onHeaderPan: onHeaderPans[index],
        });
      });
    });
    return (
      <View style={{ flex: 1 }}>
        <SpringScrollView
          bounces="horizontal"
          scrollEnabled="horizontal"
          pagingEnabled
          contentContainerStyle={{
            flex: 1,
            width: `${props.tabCount}00%`,
            flexDirection: "row",
          }}
        >
          {children}
        </SpringScrollView>
        <PanGestureHandler onGestureEvent={panHandler}>
          <Reanimated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              backgroundColor: "white",
            }}
          >
            {props.renderHeader()}
          </Reanimated.View>
        </PanGestureHandler>
      </View>
    );
  }
);
