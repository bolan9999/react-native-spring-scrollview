/*
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2021-07-21 13:05:32
 * @LastEditTime: 2021-10-19 19:50:25
 * @LastEditors: 石破天惊
 * @Description:
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


// if(this.fd){
//   if(this.fd >= pan.d){
//     if(out && !this.bounces){
//       if(parent.handle) return true;
//     }
//   } else if (parent.handle){
//      return true
//   }
// } else {
//   if(this.sd>=pan.d){
//     if(out){
//       if(parent.handle) return true;
//     }
//   } else {
//      return parent.handle
//    }
// }