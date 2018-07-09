/**
 * Author: Shi(bolan0000@icloud.com)
 * Date: 2018/7/4
 * Copyright (c) 2018, AoTang, Inc.
 *
 * Description:
 */

import { idx } from "/idx";

export function atLeastCheck(source: Object, children: string[]) {
  return !children.every(child => !idx(() => source[child]));
}
