/*
 *
 * Created by Stone
 * https://github.com/bolan9999
 * Email: shanshang130@gmail.com
 * Date: 2018/7/15
 *
 */

import React from "react";
import { StyleSheet, Text, Platform, View } from "react-native";
import { SpringScrollView } from "../src";
import {
  ChineseNormalFooter,
  ChineseNormalHeader,
  ChineseWithLastDateHeader,
  WithLastDateHeader,
  WithLastDateFooter,
  ChineseWithLastDateFooter
} from "../src/Customize";
import { CommonLottieHeader } from "../src/Customize/CommonLottieHeader";
import { CommonLottieFooter } from "../src/Customize/CommonLottieFooter";

export class RefreshAndLoadingExample extends React.Component {
  _scrollView;
  _step = 13;

  constructor(props) {
    super(props);
    this.state = {
      count: this._step,
      allLoaded: false
    };
  }

  render() {
    const arr = [];
    for (let i = 0; i < this.state.count; ++i) arr.push(i);
    return (
      <SpringScrollView
        ref={ref => (this._scrollView = ref)}
        style={styles.container}
        inverted
        onRefresh={this._onRefresh}
        onLoading={this._onLoading}
        // allLoaded={this.state.allLoaded}
        refreshHeader={CommonLottieHeader}
        loadingFooter={CommonLottieFooter}
      >
        {arr.map(item => (
          <Text key={item} style={styles.text}>
            This is a Refresh and Loading Test
          </Text>
        ))}
      </SpringScrollView>
    );
  }

  _onRefresh = () => {
    setTimeout(() => {
      this._scrollView.endRefresh();
      this.setState({ count: this._step, allLoaded: false });
    }, 3000);
  };

  _onLoading = () => {
    setTimeout(() => {
      this._scrollView.endLoading();
      this.setState(p => ({
        count: p.count + this._step,
        allLoaded: false
      }));
    }, 3000);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 20 : 0
  },
  text: {
    paddingVertical: 20,
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "white",
    transform: [{ scaleY: -1 }]
  }
});
