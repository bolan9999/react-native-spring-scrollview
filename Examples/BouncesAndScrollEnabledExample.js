/*
 *
 * Created by Stone
 * https://github.com/bolan9999
 * Email: shanshang130@gmail.com
 * Date: 2018/7/15
 *
 */

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SpringScrollView } from "../src";

export class BouncesAndScrollEnabledExample extends React.Component {
  _contentCount = 20;
  _bounces = true;
  _scrollEnabled = true;

  render() {
    const arr = [];
    for (let i = 0; i < this._contentCount; ++i) arr.push(i);
    return (
      <SpringScrollView
        style={styles.container}
        bounces={this._bounces}
        scrollEnabled={this._scrollEnabled}
        initOffset={{ x: 0, y: 100 }}
      >
        {arr.map((i, index) =>
          <TouchableOpacity
            key={index}
            onPress={() => {
              this._contentCount = 1;
              this.forceUpdate();
            }}
          >
            <Text style={styles.text}>
              Modify the '_contentCount','_bounces' and '_scrollEnabled' in
              BouncesExample.js to check if VerticalScrollView works well.
            </Text>
          </TouchableOpacity>
        )}
      </SpringScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    fontSize: 16,
    margin: 20
  }
});
