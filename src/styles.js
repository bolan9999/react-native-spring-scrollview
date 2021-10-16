/*
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2021-07-21 13:05:32
 * @LastEditTime: 2021-10-16 09:49:42
 * @LastEditors: 石破天惊
 * @Description:
 */
/*
 *
 * Created by Stone
 * https://github.com/bolan9999
 * Email: shanshang130@gmail.com
 * Date: 2019/2/14
 *
 */

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrapperStyle: {
    flexGrow: 1,
    flexShrink: 1,
    overflow: "scroll",
  },
  contentStyle: {
    flexGrow: 1,
  },
  fill: { flex: 1 },
  vIndicator: {
    top: 3,
    width: 3,
    right: 4,
    borderRadius: 3,
    position: "absolute",
    backgroundColor: "#A8A8A8",
  },
  hIndicator: {
    left: 3,
    height: 3,
    bottom: 4,
    borderRadius: 3,
    position: "absolute",
    backgroundColor: "#A8A8A8",
  },
});
