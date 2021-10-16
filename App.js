/*
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 1985-10-26 16:15:00
 * @LastEditTime: 2021-10-16 16:26:19
 * @LastEditors: 石破天惊
 * @Description:
 */
import { StatusBar } from "expo-status-bar";
import React from "react";
import ReactNative, {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Animated,
  Platform,
} from "react-native";
import {
  ScrollView,
  TouchableOpacity,
  PanGestureHandler,
  NativeViewGestureHandler,
} from "react-native-gesture-handler";
import { Examples } from "./Examples";

export default function App() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "row",
        marginTop: Platform.select({ android: 25 }),
      }}
    >
      <Examples />
      {false && nativeScrollView()}
    </SafeAreaView>
  );
}

function nativeScrollView() {
  const scrollRef = React.createRef();
  const panRef = React.createRef();
  let base = 0,
    gestureBase = 0;
  return (
    <ScrollView
      ref={scrollRef}
      style={{ flex: 1 }}
      contentContainerStyle={{ height: 1200 }}
      onLayout={(e) => console.log("height=", e.nativeEvent.layout.height)}
    >
      <View style={{ backgroundColor: "red", height: 485 }} />
      <Text>iOS Running app on iPhone 12</Text>
      <Text>iOS Running app on iPhone 12</Text>
      <Text>iOS Running app on iPhone 12</Text>
      <Text>iOS Running app on iPhone 12</Text>
      <Text>iOS Running app on iPhone 12</Text>
      <Text>iOS Running app on iPhone 12</Text>
      <Text>iOS Running app on iPhone 12</Text>
      <TouchableOpacity
        onPress={() =>
          scrollRef.current && scrollRef.current.scrollTo({ y: 100 })
        }
      >
        <Text>scroll to 100</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
