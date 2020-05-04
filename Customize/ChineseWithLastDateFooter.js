/*
 *
 * Created by Stone
 * https://github.com/bolan9999
 * Email: shanshang130@gmail.com
 * Date: 2019/1/25
 *
 */

import {WithLastDateFooter} from "./WithLastDateFooter";

export class ChineseWithLastDateFooter extends WithLastDateFooter{
  getText() {
    return "最后加载: ";
  }

  getTimeDescription() {
    if (!this.lastTime) {
      return "从未加载";
    }
    const now = new Date();
    let timeInterval = Math.floor(
      (now.getTime() - this.lastTime.getTime()) / 1000
    );
    if (timeInterval < 60) {
      return `${timeInterval}秒前`;
    } else if (timeInterval < 3600) {
      return `${Math.floor(timeInterval / 60)}分钟前`;
    } else if (
      now.getFullYear() === this.lastTime.getFullYear() &&
      now.getMonth() === this.lastTime.getMonth() &&
      now.getDate() === this.lastTime.getDate()
    ) {
      return `${this.lastTime.getHours()}:${this.lastTime.getMinutes()}`;
    } else if (now.getFullYear() === this.lastTime.getFullYear()) {
      return `${this.lastTime.getMonth() + 1}-${this.lastTime.getDate()}`;
    } else {
      return `${this.lastTime.getFullYear()}-${this.lastTime.getMonth() +
      1}-${this.lastTime.getDate()}`;
    }
  }

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
