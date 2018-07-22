/*
 *
 * Created by Stone
 * https://github.com/bolan9999
 * Email: shanshang130@gmail.com
 * Date: 2018/7/13
 *
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
  // onStateChange(oldStatus: HeaderStatus, newStatus: HeaderStatus) {
  //   // if (newStatus === "waiting" || newStatus === "refreshing") {
  //   this.setState({ status: newStatus });
  //   // }
  // }

  render() {
    return (
      <View style={styles.container}>
        {this._renderIcon()}
        <View style={styles.rContainer}>
          <Text style={styles.text}>
            {this._getTitle()}
          </Text>
          <Text style={styles.text}>最后更新：2018.7.13</Text>
        </View>
      </View>
    );
  }

  _renderIcon() {
    const s = this.state.status;
    if (s === "refreshing" || s === "cancelRefresh" || s === "rebound") {
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
                  0,
                  this.props.maxHeight - 50,
                  this.props.maxHeight,
                  this.props.maxHeight + 1
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
    if (s === "pulling" || s === "waiting") {
      return "下拉可以刷新";
    } else if (s === "pullingEnough") {
      return "松开立即刷新";
    } else if (s === "refreshing") {
      return "正在刷新数据中...";
    } else if (s === "pullingCancel") {
      return "放弃刷新";
    } else if (s === "cancelRefresh") {
      return "取消刷新";
    } else if (s === "rebound") {
      return "刷新完成";
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
