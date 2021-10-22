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
  Text,
} from "react-native";
import Reanimated, { useAnimatedStyle } from "react-native-reanimated";

export class NormalFooter extends LoadingFooter {
  static height = 80;

  static style = "stickyContent";

  render() {
    if (this.state.status === "allLoaded")
      return (
        <View style={styles.container}>
          <Text style={styles.text}>{this.getTitle()}</Text>
        </View>
      );
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
    if (props.status === "loading") {
      return <ActivityIndicator color={"gray"} />;
    }
    const { maxHeight, offset } = this.props;
    const iconStyle = useAnimatedStyle(() => {
      let rotate = 180 - ((offset.value - 40) * 180) / (maxHeight - 45);
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
    if (s === "dragging" || s === "waiting") {
      return "Drag up to load";
    } else if (s === "draggingEnough") {
      return "Release to load";
    } else if (s === "loading") {
      return "Loading ...";
    } else if (s === "draggingCancel") {
      return "Give up loading";
    } else if (s === "rebound") {
      return "Load completed";
    } else if (s === "allLoaded") {
      return "No more data";
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
