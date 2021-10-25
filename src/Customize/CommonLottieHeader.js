/*
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2021-07-22 11:57:12
 * @LastEditTime: 2021-10-25 10:21:20
 * @LastEditors: 石破天惊
 * @Description:
 */

import React, { useRef } from "react";
import { RefreshHeader } from "../RefreshHeader";
import { View } from "react-native";
import SafeModule from "react-native-safe-modules";
import LottieView from "lottie-react-native";
import Reanimated, {
  interpolate,
  useAnimatedProps,
  addWhitelistedUIProps,
  Extrapolate,
} from "react-native-reanimated";

const ReanimatedLottieView = Reanimated.createAnimatedComponent(LottieView);

Reanimated.addWhitelistedUIProps({ progress: true });
export class CommonLottieHeader extends RefreshHeader {
  static height: number = 100;

  render() {
    return (
      <View style={{ flex: 1, marginTop: 20 }}>
        <this.Lottie offset={this.props.offset} />
      </View>
    );
  }
  Lottie = (props) => {
    const animatedProps = useAnimatedProps(() => {
      const progress = interpolate(
        props.offset.value,
        [-201, -200, -150, -150, -100, -100, -50],
        [1, 1, 0, 1, 0, 1, 0],
        Extrapolate.CLAMP
      );
      return {
        progress: props.status === "refreshing" ? undefined : progress,
      };
    });
    return (
      <ReanimatedLottieView
        source={
          this.state.status === "refreshing"
            ? require("./res/refreshing2.json")
            : require("./res/refreshing.json")
        }
        autoPlay={this.state.status === "refreshing"}
        loop={this.state.status === "refreshing"}
        animatedProps={animatedProps}
      />
    );
  };
}
