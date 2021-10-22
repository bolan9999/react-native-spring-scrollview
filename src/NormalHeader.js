/*
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2020-11-05 10:44:46
 * @LastEditTime: 2021-10-22 16:55:28
 * @LastEditors: 石破天惊
 * @Description:
 */

import React from "react";
import { RefreshHeader, HeaderStatus } from "./RefreshHeader";
import {
  ActivityIndicator,
  Animated,
  View,
  StyleSheet,
  Text,
} from "react-native";
import Reanimated, {
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";

export class NormalHeader extends RefreshHeader {
  static height = 80;

  static style = "stickyContent";

  render() {
    return (
      <View style={styles.container}>
        <this.Icon {...this.props} status={this.state.status} />
        <View style={styles.rContainer}>
          <Text style={styles.text}>{this.getTitle()}</Text>
          {this.renderContent()}
        </View>
      </View>
    );
  }

  Icon = (props) => {
    if (this.state.status === "refreshing" || this.state.status === "rebound") {
      return <ActivityIndicator color={"gray"} />;
    }
    const { maxHeight, offset } = this.props;
    const iconStyle = useAnimatedStyle(() => {
      let rotate = 180 - ((offset.value + 90) * 180) / 40;
      if (rotate > 180) rotate = 180;
      if (rotate < 0) rotate = 0;
      return { transform: [{ rotate: `${rotate}deg` }] };
    });
    return (
      <Reanimated.Image
        source={require("./Customize/res/arrow.png")}
        style={iconStyle}
      />
    );
  };

  renderContent() {
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
    flexDirection: "row",
  },
  rContainer: {
    marginLeft: 20,
  },
  text: {
    marginVertical: 5,
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    width: 140,
  },
});
