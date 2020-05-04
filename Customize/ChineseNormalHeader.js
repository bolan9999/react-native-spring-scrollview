/*
 *
 * Created by Stone
 * https://github.com/bolan9999
 * Email: shanshang130@gmail.com
 * Date: 2019/1/25
 *
 */

import {NormalHeader} from "../NormalHeader";

export class ChineseNormalHeader extends NormalHeader{
  getTitle() {
    const s = this.state.status;
    if (s === "pulling" || s === "waiting") {
      return "下拉可以刷新";
    } else if (s === "pullingEnough") {
      return "松开立即刷新";
    } else if (s === "refreshing") {
      return "正在刷新数据中...";
    } else if (s === "pullingCancel") {
      return "放弃刷新";
    } else if (s === "rebound") {
      return "刷新完成";
    }
  }
}
