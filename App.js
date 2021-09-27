/*
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 1985-10-26 16:15:00
 * @LastEditTime: 2021-09-27 19:03:15
 * @LastEditors: 石破天惊
 * @Description:
 */
import { StatusBar } from "expo-status-bar";
import React from "react";
import ReactNative, { SafeAreaView, StyleSheet, Text, View, Animated } from "react-native";
import {
  ScrollView,
  PanGestureHandler,
  NativeViewGestureHandler,
  TouchableOpacity
} from "react-native-gesture-handler";
import { Test } from "./Examples/Test";
import { SpringScrollView } from "./upgrade/SpringScrollView";
import { styles } from "./upgrade/styles";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Test />
      {/* <SpringScrollView
        inverted={false}
        contentContainerStyle={{ width: "150%" }}
        style={{ flex: 1, backgroundColor: "lightgray" }}
      >
        {Array(75)
          .fill("")
          .map((_, idx) => (
            <Text key={idx}>iOS Running app on iPhone 12 {idx}</Text>
          ))}
      </SpringScrollView> */}
    </SafeAreaView>
  );
}

function nativeScrollView() {
  const scrollRef = React.createRef();
  const panRef = React.createRef();
  let base = 0,
    gestureBase = 0;
  return (
    <NativeViewGestureHandler ref={scrollRef} simultaneousHandlers={panRef}>
      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ height: 1200 }}
        onScroll={(e) => {
          if (!base) base = Math.abs(e.nativeEvent.contentOffset.y);
          console.log("onScroll", Math.abs(e.nativeEvent.contentOffset.y));
        }}
      >
        <PanGestureHandler
          ref={panRef}
          minDist={0}
          simultaneousHandlers={scrollRef}
          onGestureEvent={(e) => {
            if (base && gestureBase) {
              console.log(
                "pan",
                Math.abs(e.nativeEvent.translationY) - gestureBase
              );
            } else gestureBase = base;
          }}
        >
          <Animated.View>
            <Text>iOS Running app on iPhone 12</Text>
            <Text>iOS Running app on iPhone 12</Text>
            <Text>iOS Running app on iPhone 12</Text>
            <Text>iOS Running app on iPhone 12</Text>
            <Text>iOS Running app on iPhone 12</Text>
            <Text>iOS Running app on iPhone 12</Text>
            <Text>iOS Running app on iPhone 12</Text>
          </Animated.View>
        </PanGestureHandler>
      </Animated.ScrollView>
    </NativeViewGestureHandler>
  );
}
