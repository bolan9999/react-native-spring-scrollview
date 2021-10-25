/*
 *
 * Created by Stone
 * https://github.com/bolan9999
 * Email: shanshang130@gmail.com
 * Date: 2019/1/25
 *
 */

import { NormalFooter } from "../NormalFooter";

export class ChineseNormalFooter extends NormalFooter {
  getTitle() {
    const s = this.state.status;
    if (s === "dragging" || s === "waiting") {
      return "上拉加载更多";
    } else if (s === "draggingEnough") {
      return "松开加载更多";
    } else if (s === "loading") {
      return "正在加载数据...";
    } else if (s === "draggingCancel") {
      return "放弃加载更多";
    } else if (s === "rebound") {
      return "加载完成";
    } else if (s === "allLoaded") {
      return "已经到底啦";
    }
  }
}
