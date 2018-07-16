/*
 *
 * Created by Stone
 * https://github.com/bolan9999
 * Email: shanshang130@gmail.com
 * Date: 2018/7/12
 *
 */

import React from "react";
import { ActivityIndicator, Animated, Image, Text, View } from "react-native";

export class RefreshHeader extends React.Component<HeaderPropType, HeaderStateType> {

  constructor(props: HeaderPropType) {
    super(props);
    this.state = { status: "waiting" };
  }

  changeToState(newStatus: HeaderStatus) {
    this.state.status !== newStatus &&
      this.onStateChange(this.state.status, newStatus);
  }

  onStateChange(oldStatus: HeaderStatus, newStatus: HeaderStatus) {
    // console.log("newStatus", newStatus);
    this.setState({ status: newStatus });
  }

  render() {
    return (
      <Text style={{alignSelf:"center"}}>
        {this.state.status}
      </Text>
    );
  }
}

export type HeaderStatus =
  | "waiting"
  | "pulling"
  | "pullingEnough"
  | "pullingCancel"
  | "refreshing"
  | "cancelRefresh"
  | "rebound";

interface HeaderPropType {
  offset?: Animated.Value,
  maxHeight?:number
}

interface HeaderStateType {
  status?: HeaderStatus
}
