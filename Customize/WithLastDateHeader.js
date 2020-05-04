/*
 *
 * Created by Stone
 * https://github.com/bolan9999
 * Email: shanshang130@gmail.com
 * Date: 2019/1/25
 *
 */

import React from "react";
import { Text, StyleSheet, AsyncStorage } from "react-native";
import { NormalHeader } from "../NormalHeader";
import { HeaderStatus } from "../RefreshHeader";

const RefreshKey = "org.bolan9999.spring_scrollview.refresh_time";

export class WithLastDateHeader extends NormalHeader {
  lastTime: Date;
  constructor(props) {
    super(props);
    AsyncStorage.getItem(RefreshKey)
      .then(value => {
        if (value) this.lastTime = new Date(value);
      })
      .catch();
  }

  onStateChange(oldStatus: HeaderStatus, newStatus: HeaderStatus) {
    if (newStatus === "refreshing") {
      const now = new Date();
      AsyncStorage.setItem(RefreshKey, now.toString())
        .then(() => {
          this.lastTime = now;
        })
        .catch();
    }
    super.onStateChange(oldStatus, newStatus);
  }

  renderContent() {
    return (
      <Text style={styles.text}>
        {this.getText()}
        {this.getTimeDescription()}
      </Text>
    );
  }

  getText() {
    return "Last Updated: ";
  }

  getTimeDescription() {
    if (!this.lastTime) {
      return "never";
    }
    const now = new Date();
    let timeInterval = Math.floor(
      (now.getTime() - this.lastTime.getTime()) / 1000
    );
    if (timeInterval < 60) {
      return `${timeInterval}s ago`;
    } else if (timeInterval < 3600) {
      return `${Math.floor(timeInterval / 60)}m ago`;
    } else if (
      now.getFullYear() === this.lastTime.getFullYear() &&
      now.getMonth() === this.lastTime.getMonth() &&
      now.getDate() === this.lastTime.getDate()
    ) {
      return `${this.lastTime.getHours()}:${this.lastTime.getMinutes()}`;
    } else if (now.getFullYear() === this.lastTime.getFullYear()) {
      return `${this.lastTime.getMonth() + 1}-${this.lastTime.getDate()}`;
    } else {
      return `${this.lastTime.getMonth() +
        1}-${this.lastTime.getDate()}-${this.lastTime.getFullYear()}`;
    }
  }
}

const styles = StyleSheet.create({
  text: {
    marginVertical: 5,
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    width: 130
  }
});
