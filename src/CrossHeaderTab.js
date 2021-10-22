/*
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2021-10-18 16:05:14
 * @LastEditTime: 2021-10-22 10:54:34
 * @LastEditors: 石破天惊
 * @Description:
 */

import React from "react";
import { Dimensions, Text, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { CrossHeaderTabContext, SpringScrollView } from "./SpringScrollView";
import Reanimated, {
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

interface CrossHeaderTabType extends ViewProps {
  tabCount: number;
  renderHeader: () => React.ReactElement<any>;
  renderTab: (tab: number) => React.ReactElement<any>;
}

export const CrossHeaderTab = React.forwardRef(
  (props: CrossHeaderTabType, ref) => {
    const screenHeight = Dimensions.get("window").height;
    const arr = new Array(props.tabCount).fill(0);
    const currentPage = useSharedValue(0);
    const [headerSize] = React.useState({
      width: useSharedValue(0),
      height: useSharedValue(0),
    });
    const [tabContentOffsets] = React.useState(
      arr.map(() => ({
        x: useSharedValue(0),
        y: useSharedValue(0),
      }))
    );
    const [containerContentOffset] = React.useState({
      x: useSharedValue(0),
      y: useSharedValue(0),
    });

    const headerHeight = useDerivedValue(() => {
      return headerSize.height.value - screenHeight;
    });

    const [childrenPanActions] = React.useState(
      arr.map((_, index) => ({
        contentOffset: tabContentOffsets[index],
        crossHeaderHeight: headerHeight,
        onStart: null,
        onActive: null,
        onEnd: null,
      }))
    );
    const panHandler = {
      isParentFocus: () => {
        "worklet";
        return false;
      },
      onStart: (evt, ctx) => {
        "worklet";
        if (childrenPanActions[currentPage.value].onStart) {
          childrenPanActions[currentPage.value].onStart(evt, ctx, true);
        }
      },
      onActive: (evt, ctx) => {
        "worklet";
        if (childrenPanActions[currentPage.value].onActive) {
          childrenPanActions[currentPage.value].onActive(evt, ctx, true);
        }
      },
      onEnd: (evt, ctx) => {
        "worklet";
        if (childrenPanActions[currentPage.value].onEnd) {
          childrenPanActions[currentPage.value].onEnd(evt, ctx, true);
        }
      },
    };
    const headerStyle = useAnimatedStyle(() => {
      let translateY = tabContentOffsets[currentPage.value].y.value;
      if (translateY > headerSize.height.value - screenHeight - 50)
        translateY = headerSize.height.value - screenHeight - 50;
      return {
        position: "absolute",
        top: -screenHeight,
        paddingTop: screenHeight,
        left: 0,
        right: 0,
        backgroundColor: "white",
        transform: [{ translateY: -translateY }],
      };
    });
    tabContentOffsets.forEach((contentOffset, index) => {
      useAnimatedReaction(
        () => contentOffset.y.value,
        (res, pre) => {
          if (pre >= headerSize.height.value - screenHeight - 50 || res === pre)
            return;
          tabContentOffsets.forEach((offset, idx) => {
            if (offset.y.value !== res && idx !== currentPage.value) {
              offset.y.value = res;
            }
          });
        }
      );
    });

    const indicatorStyle = useAnimatedStyle(() => {
      return {
        position: "absolute",
        left: 0,
        bottom: 0,
        height: 3,
        width: "33.33%",
        backgroundColor: "gray",
        transform: [{ translateX: containerContentOffset.x.value / 3 }],
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
          contentOffset={containerContentOffset}
          currentPage={currentPage}
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
        <SpringScrollView
          size={headerSize}
          style={headerStyle}
          panHandler={panHandler}
        >
          {props.renderHeader()}
          <View
            style={{ flexDirection: "row", height: 50, alignItems: "center" }}
          >
            <Text style={{ flex: 1, textAlign: "center" }}>Tab1</Text>
            <Text style={{ flex: 1, textAlign: "center" }}>Tab2</Text>
            <Text style={{ flex: 1, textAlign: "center" }}>Tab3</Text>
            <Reanimated.View style={indicatorStyle} />
          </View>
        </SpringScrollView>
      </View>
    );
  }
);
