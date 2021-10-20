/*
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2021-10-18 16:05:14
 * @LastEditTime: 2021-10-20 12:13:16
 * @LastEditors: 石破天惊
 * @Description:
 */

import React from "react";
import { Text, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { CrossHeaderTabContext, SpringScrollView } from "./SpringScrollView";
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
    const [childrenPanActions] = React.useState(
      arr.map(() => ({
        crossHeaderHeight: 200,
        onStart: null,
        onActive: null,
        onEnd: null,
      }))
    );
    const panHandler = useAnimatedGestureHandler({
      onStart: (evt, ctx) => {
        if (childrenPanActions[currentIndex.value].onStart) {
          childrenPanActions[currentIndex.value].onStart(evt, ctx, true);
        }
      },
      onActive: (evt, ctx) => {
        if (childrenPanActions[currentIndex.value].onActive) {
          childrenPanActions[currentIndex.value].onActive(evt, ctx);
        }
      },
      onEnd: (evt, ctx) => {
        if (childrenPanActions[currentIndex.value].onEnd) {
          childrenPanActions[currentIndex.value].onEnd(evt, ctx);
        }
      },
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
