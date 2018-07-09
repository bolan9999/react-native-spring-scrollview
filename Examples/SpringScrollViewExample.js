/*
 *
 * Created by Stone
 * https://github.com/bolan9999
 * Email: shanshang130@gmail.com
 * Date: 2018/7/4
 *
 */

import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Easing,
  TextInput,
  ScrollView
} from "react-native";
// import { SpringScrollView } from "../spring-scrollview";
import { VerticalScrollView } from "../src";

export class SpringScrollViewExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = { scrollEnabled: false };
  }
  render() {
    return (
      <VerticalScrollView
        style={styles.container}
        ref={ref => (this.ref = ref)}
        contentStyle={styles.content}
        reboundEasing={Easing.cos}
        reboundDuration={300}
        decelerationRateWhenOut={0.9}
        showsVerticalScrollIndicator={true}
        bounces={true}
        scrollEnabled={this.state.scrollEnabled}
        getOffsetYAnimatedValue={() => {
          this.setState({ scrollEnabled: true });
          console.log("getOffsetYAnimatedValue");
        }}
      >
        {this._renderContent()}
      </VerticalScrollView>
    );
  }

  renderElement1(text) {
    return <TextInput style={styles.text} placeholder={text} key={text}/>
  }

  renderElement(text) {
    return (
      <TouchableOpacity
        style={styles.btn}
        key={text}
        onPress={() => {
          this.ref.scrollTo({ x: 0, y: 100000 });
        }}
      >
        <Text style={styles.text}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  }

  _renderContent() {
    const arr = [];
    for (let i = 0; i < 30; ++i) arr.push(`Text${i}`);
    return arr.map(this.renderElement.bind(this));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
    // backgroundColor: "gray"
  },
  content: {
    alignItems: "stretch",
    backgroundColor: "red"
  },
  btn: {},
  text: {
    marginTop: 40,
    fontSize: 25,
    alignSelf: "stretch"
  }
});
