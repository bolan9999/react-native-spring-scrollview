/*
 *
 * Created by Stone
 * https://github.com/bolan9999
 * Email: shanshang130@gmail.com
 * Date: 2018/7/4
 *
 */

import { Animated } from "react-native";

export function event(
  config: Object,
  listener: () => any,
  native: boolean = true
) {
  Animated.event([{ nativeEvent: config }], {
    listener: listener,
    useNativeDriver: native
  });
}
