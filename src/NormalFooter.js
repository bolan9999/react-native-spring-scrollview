/**
 * Author: Shi(bolan0000@icloud.com)
 * Date: 2019/1/18
 * Copyright (c) 2018, AoTang, Inc.
 *
 * Description:
 */

import React from "react";
import { LoadingFooter, FooterStatus } from "./LoadingFooter";
import {
  ActivityIndicator,
  Animated,
  View,
  StyleSheet,
  Text
} from "react-native";

export class NormalFooter extends LoadingFooter {
  render() {
    if (this.state.status === "allLoaded")
      return (
        <View style={styles.container}>
          <Text>No more data</Text>
        </View>
      );
    return (
      <View style={styles.container}>
        {this._renderIcon()}
        <View style={styles.rContainer}>
          <Text style={styles.text}>{this._getTitle()}</Text>
        </View>
      </View>
    );
  }

  _renderIcon() {
    const s = this.state.status;
    if (s === "loading" || s === "cancelLoading" || s === "rebound") {
      return <ActivityIndicator />;
    }
    const { maxHeight, offset, bottomOffset } = this.props;
    return (
      <Animated.Image
        source={require("./arrow.png")}
        style={{
          transform: [
            {
              rotate: offset.interpolate({
                inputRange: [
                  bottomOffset - 1 + 50,
                  bottomOffset + 50,
                  bottomOffset + maxHeight,
                  bottomOffset + maxHeight + 1
                ],
                outputRange: ["180deg", "180deg", "360deg", "360deg"]
              })
            }
          ]
        }}
      />
    );
  }

  _getTitle() {
    const s = this.state.status;
    if (s === "dragging" || s === "waiting") {
      return "Drag up to load";
    } else if (s === "draggingEnough") {
      return "Release to load";
    } else if (s === "loading") {
      return "Loading ...";
    } else if (s === "draggingCancel") {
      return "Give up loading";
    } else if (s === "cancelLoading") {
      return "Canceled";
    } else if (s === "rebound") {
      return "Load completed";
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  rContainer: {
    marginLeft: 20
  },
  text: {
    marginVertical: 5,
    fontSize: 18,
    color: "#666",
    width: 160
  }
});
