/*
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2021-10-16 23:07:39
 * @LastEditTime: 2021-10-18 16:19:19
 * @LastEditors: 石破天惊
 * @Description:
 */

import React, { useRef } from "react";
import { Text } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Reanimated from "react-native-reanimated";
import { CrossHeaderTab } from "../src/CrossHeaderTab";
import { SpringScrollView } from "../src/SpringScrollView";

export const ChildrenTest = () => {
  return (
    <CrossHeaderTab />
  );
};

export const ChildrenTest2 = () => {
  const pan1 = useRef();
  const pan2 = useRef();
  return (
    <PanGestureHandler
      ref={pan1}
      simultaneousHandlers={[pan1, pan2]}
      onGestureEvent={() => console.log("111")}
    >
      <Reanimated.View style={{ flex: 1, backgroundColor: "gray" }}>
        <Text>123</Text>
        <PanGestureHandler
          ref={pan2}
          simultaneousHandlers={[pan1, pan2]}
          onGestureEvent={() => console.log("222")}
        >
          <Reanimated.View
            style={{ flex: 1, marginTop: 100, backgroundColor: "red" }}
          >
            <Text>456</Text>
          </Reanimated.View>
        </PanGestureHandler>
      </Reanimated.View>
    </PanGestureHandler>
  );
};
