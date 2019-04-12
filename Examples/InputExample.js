/*
 *
 * Created by Stone
 * https://github.com/bolan9999
 * Email: shanshang130@gmail.com
 * Date: 2018/7/14
 *
 */

import React from "react";
import { SpringScrollView } from "../src";
import {TextInput, StyleSheet, Text, ScrollView} from "react-native";

export class InputExample extends React.Component {
  _topInput = React.createRef();
  _bottomInput = React.createRef();

  render() {
    return (
      <SpringScrollView
        style={styles.container}
        tapToHideKeyboard={true}
        textInputRefs={[this._topInput, this._bottomInput]}
      >
        <TextInput
          ref={this._topInput}
          style={styles.input}
          placeholder="Keyboard Test Top"
        />
        <Text style={styles.text}>
          Keyboard will never cover the focused TextInput
        </Text>
        <TextInput
          ref={this._bottomInput}
          style={styles.input}
          placeholder="Keyboard Test Bottom"
        />
      </SpringScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  input: {
    marginHorizontal: 20,
    marginVertical: 20
  },
  text: {
    marginHorizontal: 20,
    marginVertical: 300,
    fontSize: 30
  }
});

