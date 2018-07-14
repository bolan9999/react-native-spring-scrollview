/*
 *
 * Created by Stone
 * https://github.com/bolan9999
 * Email: shanshang130@gmail.com
 * Date: 2018/7/13
 *
 */

import { StyleSheet } from "react-native";
import { idx } from "./idx";

export function propsEqual(a, another) {
  return propsEqualExcept(a, another);
}

export function propsEqualExcept(
  a: Object,
  another: Object,
  except: string[] = [],
  styles: string[] = ["style"]
) {
  return Object.keys(a).every(key => {
    if (except.indexOf(key) >= 0) return true;
    const v1 = idx(() => a[key]);
    const v2 = idx(() => another[key]);
    if (styles.indexOf(key) >= 0) {
      const aStyle = StyleSheet.flatten(v1);
      const anotherStyle = StyleSheet.flatten(v2);
      return JSON.stringify(aStyle) === JSON.stringify(anotherStyle);
    }
    if (typeof v1 === "function") return true;
    return v1==v2;
  });
}
