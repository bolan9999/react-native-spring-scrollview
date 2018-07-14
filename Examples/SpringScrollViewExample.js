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
  ScrollView,
  View
} from "react-native";
// import { SpringScrollView } from "../spring-scrollview";
import { VerticalScrollView } from "../src";
import { RefreshHeader } from "../src/RefreshHeader";
import { NormalHeader } from "../src/NormalHeader";
import {LoadingFooter} from "../src/LoadingFooter";
import {NormalFooter} from "../src/NormalFooter";

export class SpringScrollViewExample extends React.Component {
  _refs;
  _scrollView;
  constructor(props) {
    super(props);
    this.state = { scrollEnabled: true, refreshing: false,loading:false };
    this._refs = [];
    for (let i = 0; i < 15; ++i) {
      this._refs.push(React.createRef());
    }
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        {/*<View style={{ height: 80, zIndex: 99 }} />*/}
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
          refreshing={this.state.refreshing}
          onRefresh={() => {
            this.setState({ refreshing: true });
            setTimeout(() => this.setState({ refreshing: false }), 1000);
          }}
          loadingFooter={NormalFooter}
          loadingFooterHeight={80}
          loading={this.state.loading}
          onLoading={()=>{
            this.setState({ loading: true });
            setTimeout(() => this.setState({ loading: false }), 1000);
          }}
        >
          {this._renderContent()}
        </VerticalScrollView>
      </View>
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
        onPress={() => {
          // this.ref.scrollTo({ x: 0, y: 100000 });
          // this.setState({ refreshing: true });
        }}
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
    for (let i = 0; i < this._refs.length; ++i) arr.push(`Text${i}`);
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
