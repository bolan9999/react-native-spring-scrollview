/*
 *
 * Created by Stone
 * https://github.com/bolan9999
 * Email: shanshang130@gmail.com
 * Date: 2018/7/22
 *
 */

import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform
} from "react-native";
import { SpringScrollView } from "../src";

export class ScrollToAndOnScrollExample extends React.Component {
  _contentCount = 20;
  _scrollView;

  render() {
    const arr = [];
    for (let i = 0; i < this._contentCount; ++i) arr.push(i);
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.scrollTo} onPress={this._scrollTo}>
          <Text>Tap to ScrollTo y=200</Text>
        </TouchableOpacity>
        <SpringScrollView
          style={styles.container}
          ref={ref => (this._scrollView = ref)}
          initOffset={{ x: 0, y: 100 }}
          onScroll={this._onScroll}
          onTouchBegin={this._onTouchBegin}
          onTouchEnd={this._onTouchEnd}
          onMomentumScrollBegin={this.onMomentumScrollBegin}
          onMomentumScrollEnd={this._onMomentumScrollEnd}
        >
          {arr.map((i, index) =>
            <Text key={index} style={styles.text}>
              Scroll and Look up the console log to check if
              'onScroll','onTouchBegin','onTouchEnd','onMomentumScrollBegin' and
              'onMomentumScrollEnd' work well!
            </Text>
          )}
        </SpringScrollView>
      </View>
    );
  }

  _scrollTo = () => {
    if (this._scrollView) {
      this._scrollView
        .scrollTo({ x: 0, y: 200 })
        .then(() => console.log("ScrollTo has finished"));
    }
  };

  _onScroll = offset => {
    console.log("onScroll", JSON.stringify(offset.nativeEvent));
  };

  _onTouchBegin = () => {
    console.log("onTouchBegin");
  };

  _onTouchEnd = () => {
    console.log("onTouchEnd");
  };

  onMomentumScrollBegin = () => {
    console.log("onMomentumScrollBegin");
  };
  _onMomentumScrollEnd = () => {
    console.log("onMomentumScrollEnd");
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollTo: {
    marginTop: Platform.OS === "ios" ? 20 : 0,
    backgroundColor: "gray",
    zIndex: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    fontSize: 16,
    margin: 20
  }
});
