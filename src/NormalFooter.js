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
  onStateChange(oldStatus: FooterStatus, newStatus: FooterStatus) {
    this.setState({ status: newStatus });
  }

  render() {
    return (
      <View style={styles.container}>
        {this._renderIcon()}
        <View style={styles.rContainer}>
          <Text style={styles.text}>
            {this._getTitle()}
          </Text>
          <Text style={styles.text}>最后加载：2018.7.13</Text>
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
                  0,
                  this.props.maxHeight - 50,
                  this.props.maxHeight,
                  Number.MAX_SAFE_INTEGER
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
      return "上拉可以加载更多数据";
    } else if (s === "draggingEnough") {
      return "松开立即加载";
    } else if (s === "loading") {
      return "正在加载数据中...";
    } else if (s === "draggingCancel") {
      return "放弃加载";
    } else if (s === "cancelLoading") {
      return "取消加载";
    } else if (s === "rebound") {
      return "加载完成";
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
