/*
 *
 * Created by Stone
 * https://github.com/bolan9999
 * Email: shanshang130@gmail.com
 * Date: 2018/7/4
 *
 */

import React from "react";
import { StyleSheet, Text, TouchableOpacity,Easing } from "react-native";
// import { SpringScrollView } from "../spring-scrollview";
import { VerticalScrollView } from "../src";

export class SpringScrollViewExample extends React.Component {
  render() {
    const arr = [];
    for (let i = 0; i < 30; ++i) arr.push(`Text${i}`);
    return (
      <VerticalScrollView
        style={styles.container}
        contentStyle={styles.content}
        reboundEasing={Easing.cos}
        reboundDuration={300}
        decelerationRateWhenOut={0.9}
        showsVerticalScrollIndicator={true}
        bounces={true}
        scrollEnabled={true}
        // onScroll={(offset)=>console.log("=====>",JSON.stringify(offset))}
      >
        {arr.map(text => <Text key={text} style={styles.text}>{text}</Text>)}
      </VerticalScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "gray"
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
