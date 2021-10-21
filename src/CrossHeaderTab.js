/*
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2021-10-18 16:05:14
 * @LastEditTime: 2021-10-21 17:07:51
 * @LastEditors: 石破天惊
 * @Description:
 */

import React from "react";
import { Text, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { CrossHeaderTabContext, SpringScrollView } from "./SpringScrollView";
import Reanimated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
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
    const [contentOffsets] = React.useState(
      arr.map(() => ({
        x: useSharedValue(0),
        y: useSharedValue(0),
      }))
    );
    const [childrenPanActions] = React.useState(
      arr.map((_, index) => ({
        contentOffset: contentOffsets[index],
        crossHeaderHeight: 200,
        onStart: null,
        onActive: null,
        onEnd: null,
      }))
    );
    const panHandler = {
      onStart: (evt, ctx) => {
        "worklet";
        if (childrenPanActions[currentIndex.value].onStart) {
          childrenPanActions[currentIndex.value].onStart(evt, ctx, true);
        }
      },
      onActive: (evt, ctx) => {
        "worklet";
        if (childrenPanActions[currentIndex.value].onActive) {
          childrenPanActions[currentIndex.value].onActive(evt, ctx, true);
        }
      },
      onEnd: (evt, ctx) => {
        "worklet";
        if (childrenPanActions[currentIndex.value].onEnd) {
          childrenPanActions[currentIndex.value].onEnd(evt, ctx, true);
        }
      },
    };
    const headerStyle = useAnimatedStyle(() => {
      let translateY = -contentOffsets[currentIndex.value].y.value;
      if (translateY < 0) translateY = 0;
      return {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        transform: [{ translateY }],
      };
    });
    return (
      <View style={{ flex: 1 }}>
        <SpringScrollView
          bounces="horizontal"
          scrollEnabled="horizontal"
          pagingEnabled="horizontal"
          contentContainerStyle={{
            flex: 1,
            width: `${props.tabCount}00%`,
            flexDirection: "row",
          }}
        >
          {arr.map((_, index) => {
            return (
              <CrossHeaderTabContext.Provider
                key={index}
                value={childrenPanActions[index]}
              >
                {props.renderTab(index)}
              </CrossHeaderTabContext.Provider>
            );
          })}
        </SpringScrollView>
        <SpringScrollView style={headerStyle} panHandler={panHandler}>
          {props.renderHeader()}
        </SpringScrollView>
      </View>
    );
  }
);
