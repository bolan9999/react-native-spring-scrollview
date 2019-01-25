/**
 * Author: Shi(bolan0000@icloud.com)
 * Date: 2019/1/18
 * Copyright (c) 2018, AoTang, Inc.
 *
 * Description:
 */

import React from "react";
import { RefreshHeader, HeaderStatus } from "./RefreshHeader";
import {
  ActivityIndicator,
  Animated,
  View,
  StyleSheet,
  Text
} from "react-native";

export class NormalHeader extends RefreshHeader {
  static height = 80;

  static style = "stickyContent";

  render() {
    return (
      <View style={styles.container}>
        {this._renderIcon()}
        <View style={styles.rContainer}>
          <Text style={styles.text}>
            {this.getTitle()}
          </Text>
          {this.renderContent()}
        </View>
      </View>
    );
  }

  _renderIcon() {
    const s = this.state.status;
    if (s === "refreshing" || s === "rebound") {
      return <ActivityIndicator color={"gray"}/>;
    }
    const { maxHeight, offset } = this.props;
    return (
      <Animated.Image
        source={require("./Customize/res/arrow.png")}
        style={{
          transform: [
            {
              rotate: offset.interpolate({
                inputRange: [-maxHeight - 1 - 10, -maxHeight - 10, -50, -49],
                outputRange: ["180deg", "180deg", "0deg", "0deg"]
              })
            }
          ]
        }}
      />
    );
  }

  renderContent(){
    return null;
  }

  getTitle() {
    const s = this.state.status;
    if (s === "pulling" || s === "waiting") {
      return "Pull down to refresh";
    } else if (s === "pullingEnough") {
      return "Release to refresh";
    } else if (s === "refreshing") {
      return "Refreshing ...";
    } else if (s === "pullingCancel") {
      return "Give up refreshing";
    } else if (s === "rebound") {
      return "Refresh completed";
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
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    width: 140
  }
});
