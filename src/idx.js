/**
 * Author: Shi(bolan0000@icloud.com)
 * Date: 2018/7/4
 * Copyright (c) 2018, AoTang, Inc.
 *
 * Description:
 */

export function idx<T>(f: () => T, defaultValue?: T | string) {
  try {
    const res = f();
    return res === null || res === undefined ? defaultValue : res;
  } catch (e) {
    return defaultValue;
  }
}
