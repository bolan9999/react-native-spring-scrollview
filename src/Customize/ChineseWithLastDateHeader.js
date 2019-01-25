/*
 *
 * Created by Stone
 * https://github.com/bolan9999
 * Email: shanshang130@gmail.com
 * Date: 2019/1/25
 *
 */

import { WithLastDateHeader } from "./WithLastDateHeader";

export class ChineseWithLastDateHeader extends WithLastDateHeader {
  getText() {
    return "最后更新: ";
  }

  getTimeDescription() {
    if (!this.lastTime) {
      return "从未更新";
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
}
