/*
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2021-07-22 11:57:17
 * @LastEditTime: 2021-10-22 17:42:45
 * @LastEditors: 石破天惊
 * @Description:
 */

import React from "react";
import { RefreshHeader } from "../RefreshHeader";
import { View } from "react-native";
import LottieView from "lottie-react-native";
import Reanimated, {
  interpolate,
  useAnimatedProps,
  addWhitelistedUIProps,
  Extrapolate,
} from "react-native-reanimated";

Reanimated.addWhitelistedUIProps({ progress: true });

const ReanimatedLottieView = Reanimated.createAnimatedComponent(LottieView);
export class CommonLottieFooter extends RefreshHeader {
  static height: number = 100;

  render() {
    if (this.state.status === "allLoaded") return null;
    return (
      <View style={{ flex: 1, marginBottom: 20 }}>
        <this.Lottie offset={this.props.offset} status={this.state.status} />
      </View>
    );
  }

  Lottie = (props) => {
    const animatedProps = useAnimatedProps(() => {
      const progress = interpolate(
        props.offset.value,
        [50, 100],
        [0, 1],
        Extrapolate.CLAMP
      );
      return {
        progress: props.status === "loading" ? undefined : progress,
      };
    });
    return (
      <ReanimatedLottieView
        key={props.status === "loading"}
        source={require("./res/loading.json")}
        autoPlay={props.status === "loading"}
        loop={props.status === "loading"}
        speed={2}
        animatedProps={animatedProps}
      />
    );
  };
}
