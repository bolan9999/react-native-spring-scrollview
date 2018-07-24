/*
 *
 * Created by Stone
 * Email: shanshang130@gmail.com
 * Date: 2018/7/14
 *
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
          <Text style={styles.text}>
            {this._getTitle()}
          </Text>
        </View>
      </View>
    );
  }

  _renderIcon() {
    const s = this.state.status;
    if (s === "loading" || s === "cancelLoading" || s === "rebound") {
      return <ActivityIndicator />;
    }
    return (
      <Animated.Image
        source={require("./arrow.png")}
        resizeMode="center"
        style={{
          width: 24,
          height: 24,
          transform: [
            {
              rotate: this.props.offset.interpolate({
                inputRange: [
                  -this.props.maxHeight - 1,
                  -this.props.maxHeight,
                  50 - this.props.maxHeight,
                  0
                ],
                outputRange: ["0deg", "0deg", "180deg", "180deg"]
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
      return "Drag up to load more data";
    } else if (s === "draggingEnough") {
      return "Release to load more data";
    } else if (s === "loading") {
      return "Loading...";
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
    color: "#666"
  }
});
