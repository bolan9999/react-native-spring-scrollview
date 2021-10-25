/*
 *
 * Created by Stone
 * https://github.com/bolan9999
 * Email: shanshang130@gmail.com
 * Date: 2019/2/18
 *
 */

import React from "react";
import { RefreshHeader } from "../RefreshHeader";
import { View } from "react-native";
let LottieView;

export class CommonLottieHeader extends RefreshHeader {
  static height: number = 100;
  constructor(props){
    super(props);
    if (!LottieView) LottieView = require("lottie-react-native");
  }

  render() {
    let progress = this.props.offset.interpolate({
      inputRange: [-200, -150, -150, -100, -100, -50],
      outputRange: [1, 0, 1, 0, 1, 0]
    });
    if (this.state.status === "refreshing") {
      progress = undefined;
    }
    return (
      <View style={{ flex: 1, marginTop: 20 }}>
        <LottieView
          source={
            this.state.status === "refreshing" ? require("./res/refreshing2.json") : require("./res/refreshing.json")
          }
          progress={progress}
          autoPlay={this.state.status === "refreshing"}
          loop={this.state.status === "refreshing"}
        />
      </View>
    );
  }
}
