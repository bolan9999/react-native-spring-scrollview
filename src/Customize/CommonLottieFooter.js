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

export class CommonLottieFooter extends RefreshHeader {
  static height: number = 100;

  constructor(props){
    super(props);
    if (!LottieView) LottieView = require("lottie-react-native");
  }

  render() {
    if (this.state.status === "allLoaded") return null;
    const { offset, bottomOffset } = this.props;
    let progress = offset.interpolate({
      inputRange: [
        bottomOffset + 50,
        bottomOffset + 500
      ],
      outputRange: [0, 1]
    });
    if (this.state.status === "loading") {
      progress = undefined;
    }
    return (
      <View style={{ flex: 1, marginBottom: 20 }}>
        <LottieView
          key={this.state.status === "loading"}
          source={require("./res/loading.json")}
          progress={progress}
          autoPlay={this.state.status === "loading"}
          loop={this.state.status === "loading"}
          speed={2}
        />
      </View>
    );
  }
}
