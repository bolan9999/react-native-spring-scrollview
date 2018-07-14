/*
 *
 * Created by Stone
 * https://github.com/bolan9999
 * Email: shanshang130@gmail.com
 * Date: 2018/7/14
 *
 */

import React from "react";
import { VerticalScrollView } from "../src";
import { TextInput, StyleSheet, Text } from "react-native";

export class InputExample extends React.Component {
  _topInput = React.createRef();
  _bottomInput = React.createRef();

  render() {
    const arr = [];
    for (let i = 0; i < 20; ++i) arr.push(i);
    return (
      <VerticalScrollView
        style={{ flex: 1 }}
        contentStyle={styles.content}
        bounces={false}
        textInputRefs={[this._topInput, this._bottomInput]}
        dampingCoefficient={0.5}
      >
        <TextInput
          ref={this._topInput}
          style={styles.top}
          placeholder="Keyboard Test Top"
        />
        {arr.map((i, index) =>
          <Text key={index} style={styles.text}>
            Fill Content
          </Text>
        )}
        <TextInput
          ref={this._bottomInput}
          style={styles.bottom}
          placeholder="Keyboard Test Bottom"
        />
      </VerticalScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between"
  },
  content: {
    alignItems: "stretch"
  },
  top: {
    margin: 50
  },
  text: {
    fontSize: 30
  },
  bottom: {
    margin: 50
  }
});
