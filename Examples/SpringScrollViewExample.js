/*
 *
 * Created by Stone
 * https://github.com/bolan9999
 * Email: shanshang130@gmail.com
 * Date: 2018/7/4
 *
 */

import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
// import { SpringScrollView } from "../spring-scrollview";
import { SpringScrollView } from "../src";

export class SpringScrollViewExample extends React.Component {
  render() {
    const arr = [];
    for (let i = 0; i < 100; ++i) arr.push(`Text${i}`);
    return (
      <SpringScrollView
        style={styles.container}
        contentStyle={styles.content}
      >
        {arr.map(text => <Text key={text} style={styles.text}>{text}</Text>)}
      </SpringScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gray"
  },
  content: {
    alignItems: "center",
    backgroundColor:"red"
  },
  text: {
    marginTop: 40,
    fontSize: 25
  }
});
