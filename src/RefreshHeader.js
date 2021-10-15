/*
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2020-11-05 10:44:46
 * @LastEditTime: 2021-10-14 09:45:45
 * @LastEditors: 石破天惊
 * @Description: 
 */

import React from "react";
import { ActivityIndicator, Animated, Image, Text, View } from "react-native";

export class RefreshHeader extends React.Component<
  HeaderPropType,
  HeaderStateType
> {

  static height = 80;

  static style = "stickyContent";

  constructor(props: HeaderPropType) {
    super(props);
    this.state = { status: "waiting" };
  }

  changeToState(newStatus: HeaderStatus) {
    this.state.status !== newStatus &&
      this.onStateChange(this.state.status, newStatus);
  }

  onStateChange(oldStatus: HeaderStatus, newStatus: HeaderStatus) {
    this.setState({ status: newStatus });
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize:18 }}>{this.state.status}</Text>
      </View>
    );
  }
}

export type HeaderStatus =
  | "waiting"
  | "pulling"
  | "pullingEnough"
  | "pullingCancel"
  | "refreshing"
  | "rebound";

interface HeaderPropType {
  offset?: Animated.Value;
  maxHeight?: number;
  bottomOffset?: number;
}

interface HeaderStateType {
  status?: HeaderStatus;
}
