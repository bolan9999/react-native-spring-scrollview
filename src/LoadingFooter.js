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

export class LoadingFooter extends React.Component<
  FooterPropType,
  FooterStateType
> {
  constructor(props: FooterPropType) {
    super(props);
    this.state = { status: props.allLoaded ? "allLoaded" : "waiting" };
  }

  componentWillReceiveProps(nextProps: FooterPropType) {
    if (nextProps.allLoaded) this.setState({ status: "allLoaded" });
  }

  changeToState(newStatus: FooterStatus) {
    !this.props.allLoaded &&
      this.state.status !== newStatus &&
      this.onStateChange(this.state.status, newStatus);
  }

  onStateChange(oldStatus: FooterStatus, newStatus: FooterStatus) {
    // console.log("newStatus", newStatus);
    this.setState({ status: newStatus });
  }

  render() {
    return (
      <Text
        style={{
          flex: 1,
          alignSelf: "center",
          lineHeight: this.props.maxHeight,
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
  | "rebound"
  | "allLoaded";

interface FooterPropType {
  offset?: Animated.Value,
  maxHeight?: number,
  allLoaded?: boolean
}

interface FooterStateType {
  status?: FooterStatus
}
