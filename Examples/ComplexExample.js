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
  View
} from "react-native";
import { VerticalScrollView } from "../src";
import { NormalHeader } from "../src/NormalHeader";
import { NormalFooter } from "../src/NormalFooter";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";

class ComplexExampleStatic extends React.Component {
  _refs;
  _scrollView;
  constructor(props) {
    super(props);
    this.state = {
      scrollEnabled: true,
      refreshing: false,
      loading: false,
      number: 15
    };
    this._refs = [];
    for (let i = 0; i < this.state.number; ++i) {
      this._refs.push(React.createRef());
    }
  }

  render() {
    return (
      <VerticalScrollView
        style={styles.container}
        ref={ref => (this._scrollView = ref)}
        contentStyle={styles.content}
        reboundEasing={Easing.cos}
        reboundDuration={300}
        decelerationRateWhenOut={0.9}
        showsVerticalScrollIndicator={true}
        bounces={true}
        scrollEnabled={this.state.scrollEnabled}
        textInputRefs={this._refs}
        inputToolBarHeight={20}
        refreshHeader={NormalHeader}
        onRefresh={() => {
          this._scrollView.beginRefresh();
          setTimeout(() => this._scrollView.endRefresh(), 1000);
        }}
        loadingFooter={NormalFooter}
        loadingFooterHeight={80}
        onLoading={() => {
          this._scrollView.beginLoading();
          setTimeout(() => this._scrollView.endLoading(true), 1000);
        }}
      >
        {this._renderContent()}
      </VerticalScrollView>
    );
  }

  renderElement1(text, index) {
    return (
      <TextInput
        ref={this._refs[index]}
        style={styles.text}
        placeholder={text}
        key={text}
      />
    );
  }

  renderElement(text) {
    return (
      <TouchableOpacity
        style={styles.btn}
        key={text}
        onPress={() => console.log("text")}
      >
        <Text style={styles.text}>
          {text}
        </Text>
        <View style={styles.line} />
      </TouchableOpacity>
    );
  }

  _renderContent() {
    const arr = [];
    for (let i = 0; i < this.state.number; ++i) arr.push(`Text${i}`);
    return arr.map(this.renderElement.bind(this));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
    // marginTop:20
    // overflow: "visible"
  },
  content: {
    // alignItems: "stretch"
    backgroundColor: "#EEE"
  },
  btn: {},
  text: {
    marginTop: 40,
    fontSize: 25,
    textAlign: "center",
    alignSelf: "stretch"
  },
  line: {
    height: 1,
    backgroundColor: "#EEE"
  }
});

export const ComplexExample = gestureHandlerRootHOC(ComplexExampleStatic);
