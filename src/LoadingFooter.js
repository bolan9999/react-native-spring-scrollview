/*
 *
 * Created by Stone
 * https://github.com/bolan9999
 * Email: shanshang130@gmail.com
 * Date: 2018/7/14
 *
 */

import React from "react";
import { Animated, Text } from "react-native";

export class LoadingFooter extends React.Component<FooterPropType, StateType> {
  constructor(props: FooterPropType) {
    super(props);
    this.state = { status: "waiting" };
  }

  changeToState(newStatus: FooterStatus) {
    this.state.status !== newStatus &&
      this.onStateChange(this.state.status, newStatus);
  }

  onStateChange(oldStatus: FooterStatus, newStatus: FooterStatus) {
    console.log("newStatus", newStatus);
    this.setState({ status: newStatus });
  }

  render() {
    return (
      <Text
        style={{
          flex: 1,
          alignSelf: "center",
          lineHeight: 80,
          textAlign: "center"
        }}
      >
        {this.state.status}
      </Text>
    );
  }
}

export type FooterStatus =
  | "waiting"
  | "dragging"
  | "draggingEnough"
  | "draggingCancel"
  | "releaseRebound"
  | "loading"
  | "cancelLoading"
  | "rebound";

interface FooterPropType {
  offset?: Animated.Value,
  maxHeight?: number
}

interface StateType {
  status?: FooterStatus
}
