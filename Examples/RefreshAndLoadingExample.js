/*
 *
 * Created by Stone
 * https://github.com/bolan9999
 * Email: shanshang130@gmail.com
 * Date: 2018/7/15
 *
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { VerticalScrollView } from "../src";
import { NormalHeader } from "../src/NormalHeader";
import { NormalFooter } from "../src/NormalFooter";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";

class RefreshAndLoadingExampleStatic extends React.Component {
  _scrollView;
  _step = 8;

  constructor(props) {
    super(props);
    this.state = { count: this._step, allLoaded: false };
  }

  render() {
    const arr = [];
    for (let i = 0; i < this.state.count; ++i) arr.push(i);
    return (
      <VerticalScrollView
        ref={ref => (this._scrollView = ref)}
        style={styles.container}
        refreshHeaderHeight={60}
        refreshHeader={NormalHeader}
        onRefresh={this._onRefresh}
        loadingFooterHeight={60}
        loadingFooter={NormalFooter}
        onLoading={this._onLoading}
        allLoaded={this.state.allLoaded}
      >
        {arr.map(item =>
          <Text key={item} style={styles.text}>
            This is a Normal Refresh and Loading Test
          </Text>
        )}
      </VerticalScrollView>
    );
  }

  _onRefresh = () => {
    this._scrollView.beginRefresh();
    setTimeout(() => {
      this._scrollView.endRefresh();
      this.setState({ count: this._step });
    }, 1000);
  };

  _onLoading = () => {
    this._scrollView.beginLoading();
    setTimeout(() => {
      this._scrollView.endLoading();
      this.setState(p => ({
        count: p.count + this._step,
        allLoaded: !p.allLoaded
      }));
    }, 1000);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    margin: 20,
    fontSize: 20
  }
});

export const RefreshAndLoadingExample = gestureHandlerRootHOC(
  RefreshAndLoadingExampleStatic
);
