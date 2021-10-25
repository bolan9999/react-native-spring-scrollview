/*
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2021-07-21 13:05:32
 * @LastEditTime: 2021-10-25 12:53:24
 * @LastEditors: 石破天惊
 * @Description:
 */
/*
 *
 * Created by Stone
 * https://github.com/bolan9999
 * Email: shanshang130@gmail.com
 * Date: 2018/7/15
 *
 */

import React from "react";
import {
  StyleSheet,
  Text,
  Platform,
  View,
  TouchableOpacity,
} from "react-native";
import { SpringScrollView } from "../src";
import {
  ChineseNormalFooter,
  ChineseNormalHeader,
  ChineseWithLastDateHeader,
  WithLastDateHeader,
  WithLastDateFooter,
  ChineseWithLastDateFooter,
} from "../src/Customize";
import { CommonLottieHeader } from "../src/Customize/CommonLottieHeader";
// import { CommonLottieFooter } from "../src/Customize/CommonLottieFooter";

export class RefreshAndLoadingExample extends React.Component {
  _scrollView;
  _step = 33;

  constructor(props) {
    super(props);
    this.state = {
      count: this._step,
      allLoaded: false,
      refreshing: false,
      loadingMore: false,
      preventReRender: false,
    };
  }

  render() {
    const arr = [];
    for (let i = 0; i < this.state.count; ++i) arr.push(i);
    return (
      <SpringScrollView
        ref={(ref) => (this._scrollView = ref)}
        style={styles.container}
        inverted={false}
        onRefresh={this._onRefresh}
        onLoadingMore={this._onLoading}
        // onScroll={()=>console.log("RefreshAndLoadingExample onScroll")}
        allLoaded={this.state.allLoaded}
        refreshHeader={CommonLottieHeader}
        loadingFooter={ChineseWithLastDateFooter}
        refreshing={this.state.refreshing}
        loadingMore={this.state.loadingMore}
        preventReRender={this.state.preventReRender}
      >
        <TouchableOpacity
          style={styles.text}
          onPress={() => this._scrollView.beginRefresh()}
        >
          <Text>BeginRefresh</Text>
        </TouchableOpacity>
        {arr.map((item) => (
          <Text key={item} style={styles.text}>
            This is a Refresh and Loading Test{item}
          </Text>
        ))}
      </SpringScrollView>
    );
  }

  _onRefresh = () => {
    this.setState({ refreshing: true, preventReRender: true });
    setTimeout(() => {
      this.setState({
        count: this._step,
        allLoaded: false,
        refreshing: false,
        preventReRender: false,
      });
    }, 3000);
  };

  _onLoading = () => {
    this.setState({ loadingMore: true, preventReRender: true });
    setTimeout(() => {
      this.setState((p) => ({
        count: p.count + this._step,
        allLoaded: true,
        loadingMore: false,
        preventReRender: false,
      }));
    }, 3000);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 20 : 0,
  },
  text: {
    marginHorizontal: 50,
    paddingVertical: 20,
    fontSize: 16,
    textAlign: "center",
    // transform: [{scaleY: -1}],
  },
});
