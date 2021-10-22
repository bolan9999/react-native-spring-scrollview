/*
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2021-10-18 16:03:04
 * @LastEditTime: 2021-10-21 20:06:55
 * @LastEditors: 石破天惊
 * @Description:
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SpringScrollView } from "../src/SpringScrollView";
import { CrossHeaderTab } from "../src/CrossHeaderTab";

export class CrossHeaderTabExample extends React.Component {
  render() {
    return (
      <CrossHeaderTab
        tabCount={3}
        renderHeader={() => (
          <View
            style={{
              padding: 25,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#EEE",
            }}
          >
            <Text>I am Header</Text>
            <SpringScrollView
              style={{
                flex: 0,
                width: 200,
                height: 100,
                backgroundColor: "lightgray",
              }}
              bounces="horizontal"
              pagingEnabled="horizontal"
              scrollEnabled="horizontal"
              contentContainerStyle={{ width: "300%", flexDirection: "row" }}
            >
              <View style={styles.banner}>
                <Text>I am Banner1</Text>
              </View>
              <View style={styles.banner}>
                <Text>I am Banner2</Text>
              </View>
              <View style={styles.banner}>
                <Text>I am Banner3</Text>
              </View>
            </SpringScrollView>
          </View>
        )}
        renderTab={(idx) => (
          <SpringScrollView>
            <Text style={{ fontSize: 25 }}>{content}</Text>
          </SpringScrollView>
        )}
      />
    );
  }
}

const styles = StyleSheet.create({
  banner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

const content =
  "In React Native apps, the application code is executed outside of the " +
  "application main thread. \nThis is one of the key elements of React Native " +
  "architecture and helps with preventing frame drops in cases where JavaScript" +
  " has some heavy work to do. \nUnfortunately this design does not play well" +
  " when it comes to event driven interactions. \nWhen interacting with a touch" +
  " screen, the user expects effects on screen to be immediate. \nIf updates are" +
  " happening in a separate thread it is often a case that changes done in the" +
  " JavaScript thread cannot be reflected in the same frame. \nIn React Native by" +
  " default all updates are delayed by at least one frame as the communication" +
  " between UI and JavaScript thread is asynchronous and UI thread never waits" +
  " for the JavaScript thread to finish processing events. \nOn top of the lag" +
  " with JavaScript playing many roles like running react diffing and updates," +
  " executing app's business logic, processing network requests, etc., it is" +
  " often the case that events can't be immediately processed thus causing even" +
  " more significant delays. \nReanimated aims to provide ways of offloading" +
  " animation and event handling logic off of the JavaScript thread and onto" +
  " the UI thread. \nThis is achieved by defining Reanimated worklets – a tiny " +
  "chunks of JavaScript code that can be moved to a separate JavaScript VM and" +
  " executed synchronously on the UI thread. \nThis makes it possible to respond " +
  "to touch events immediately and update the UI within the same frame when the" +
  " event happens without worrying about the load that is put on the main " +
  "JavaScript thread.";
