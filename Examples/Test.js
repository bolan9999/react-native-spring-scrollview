/*
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2021-07-16 17:29:37
 * @LastEditTime: 2021-10-18 15:50:56
 * @LastEditors: 石破天惊
 * @Description:
 */

import React from "react";
import {
  StyleSheet,
  Switch,
  TextInput,
  View,
  Text,
  ScrollView,
  Animated,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SpringScrollView } from "../src/SpringScrollView";
// import { CommonLottieHeader, CommonLottieFooter } from "../src/Customize";

const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity);
export class Test extends React.Component {
  _main: SpringScrollView;
  _container: SpringScrollView;
  _defaultState = {
    inverted: false,
    // bounces: true,
    // scrollEnabled: true,
    directionalLockEnabled: true,
    showsVerticalScrollIndicator: true,
    showsHorizontalScrollIndicator: true,
    dragToHideKeyboard: true,
    pagingEnabled: false,
    decelerationRate: 0.998,
    pageSize: { width: 0, height: 0 },
    contentContainerStyle: { width: "100%", height: "350%" },
  };
  state = {
    ...this._defaultState,
    log: "Log View:\n",
    allLoaded: false,
    logNativeOffset: { y: new Animated.Value(0) },
    refreshing: false,
    preventReRender: false,
    loadingMore: false,
  };

  _contentStyleRef = React.createRef();
  _pageSizeRef = React.createRef();
  _decelerationRateRef = React.createRef();

  render() {
    const propertyKeys = Object.keys(this.state).filter(
      (key, index) =>
        index < Object.keys(this.state).findIndex((v) => v === "log")
    );
    return (
      <SpringScrollView
        bounces={false}
        scrollEnabled={false}
        style={cs.container}
        ref={(ref) => (this._container = ref)}
        contentContainerStyle={cs.content}

        // refreshHeader={CommonLottieHeader}
        // loadingFooter={CommonLottieFooter}
      >
        <View style={cs.main}>
          <View style={cs.mainScroll}>
            <SpringScrollView
              {...this.state}
              inputToolBarHeight={Platform.select({ ios: 44, android: 200 })}
              textInputRefs={[
                this._contentStyleRef,
                this._pageSizeRef,
                this._decelerationRateRef,
              ]}
              bounces
              scrollEnabled
              onRefresh={this._onRefresh}
              onLoadingMore={this._onLoading}
              allLoaded={this.state.allLoaded}
              refreshing={this.state.refreshing}
              preventReRender={this.state.preventReRender}
              loadingMore={this.state.loadingMore}
              // ref={(ref) => (this._main = ref)}
              onScroll={this._onScroll}
              onTouchBegin={this._onTouchBegin}
              onTouchEnd={this._onTouchEnd}
              onMomentumScrollBegin={this.onMomentumScrollBegin}
              onMomentumScrollEnd={this._onMomentumScrollEnd}
              onScrollBeginDrag={this._onScrollBeginDrag}
              onScrollEndDrag={this._onScrollEndDrag}
              onSizeChange={this._onSizeChange}
              onContentSizeChange={this._onContentSizeChange}
            >
              <TouchableOpacity
                style={[
                  rs.row,
                  { justifyContent: "center", backgroundColor: "gray" },
                ]}
                onPress={this._beginRefresh}
              >
                <Text style={rs.title}>Click to begin refresh</Text>
                <View style={rs.line} />
              </TouchableOpacity>
              {propertyKeys.map((key, index) => {
                let inputRef;
                if (key === "contentStyle") inputRef = this._contentStyleRef;
                if (key === "pageSize") inputRef = this._pageSizeRef;
                if (key === "decelerationRate")
                  inputRef = this._decelerationRateRef;
                return (
                  <this.Row
                    key={key}
                    title={key}
                    isInput={typeof this.state[key] !== "boolean"}
                    value={this.state[key]}
                    inputRef={inputRef}
                    onChange={(e) => this._onChange(e, key)}
                  />
                );
              })}
              <Text style={cs.tips}>{tips}</Text>
            </SpringScrollView>
          </View>
          <this.SmallButton
            text={"+"}
            style={cs.increaseWidth}
            onPress={this._onIncreaseWidth}
          />
          <this.SmallButton
            text={"+"}
            style={cs.increaseHeight}
            onPress={this._onIncreaseHeight}
          />
          <this.SmallButton
            text={"-"}
            style={cs.reduceHeight}
            onPress={this._onReduceHeight}
          />
          <this.SmallButton
            text={"-"}
            style={cs.reduceWidth}
            onPress={this._onReduceWidth}
          />
        </View>
        <View style={cs.log}>
          <SpringScrollView
            inverted
            onNativeContentOffsetExtract={this.state.logNativeOffset}
          >
            <Text style={cs.inverted}>{this.state.log}</Text>
            <AnimatedButton
              style={this._getClearButtonStyle()}
              onPress={this._clearLog}
            >
              <Text style={cs.clearText}>CLEAR</Text>
            </AnimatedButton>
          </SpringScrollView>
        </View>
      </SpringScrollView>
    );
  }

  //#region Test refresh and loading
  _beginRefresh = () => this._container.beginRefresh();
  _onRefresh = () => {
    this._log("Refresh start");
    this.setState({ refreshing: true, preventReRender: true });
    setTimeout(() => {
      this._log("Refresh end");
      this.setState({
        ...this._defaultState,
        refreshing: false,
        preventReRender: false,
      });
    }, 1500);
  };

  _onLoading = () => {
    this._log("Loading start");
    this.setState({ loadingMore: true, preventReRender: true });
    setTimeout(() => {
      this.setState({
        ...this._defaultState,
        loadingMore: false,
        preventReRender: false,
      });
      // this._container && this._container.endLoading(true);
      this._log("Loading end");
    }, 1500);
  };
  //#endregion
  //#region Test Content Size Change
  _onSizeChange = ({ width, height }) =>
    this._log(`onSizeChange width=${width} height=${height}`);
  _onContentSizeChange = ({ width, height }) =>
    this._log(`onContentSizeChange width=${width} height=${height}`);

  _onIncreaseWidth = () => {
    let { width, height } = this.state.contentContainerStyle;
    const w = parseInt(width) + 50;
    this.setState({ contentContainerStyle: { width: `${w}%`, height } });
  };

  _onIncreaseHeight = () => {
    let { width, height } = this.state.contentContainerStyle;
    const h = parseInt(height) + 50;
    this.setState({ contentContainerStyle: { width, height: `${h}%` } });
  };

  _onReduceWidth = () => {
    let { width, height } = this.state.contentContainerStyle;
    const w = parseInt(width) - 50;
    this.setState({ contentContainerStyle: { width: `${w}%`, height } });
  };
  _onReduceHeight = () => {
    let { width, height } = this.state.contentContainerStyle;
    const h = parseInt(height) - 50;
    this.setState({ contentContainerStyle: { width, height: `${h}%` } });
  };
  //#endregion
  // #region Test Event
  _onTouchBegin = () => {
    this._log("onTouchBegin");
  };

  _onTouchEnd = () => {
    this._log("onTouchEnd");
  };

  onMomentumScrollBegin = () => {
    this._log("onMomentumScrollBegin");
  };
  _onMomentumScrollEnd = () => {
    this._log("onMomentumScrollEnd");
  };

  _onScrollBeginDrag = () => {
    this._log("onScrollBeginDrag");
  };

  _onScrollEndDrag = () => {
    this._log("onScrollEndDrag");
  };
  _onScroll = ({ nativeEvent: { contentOffset } }) =>
    console.log("onScroll", contentOffset);
  // #endregion
  //#region Other functions
  _getClearButtonStyle = () => {
    return StyleSheet.flatten([
      cs.clear,
      {
        transform: [
          { scaleY: -1 },
          {
            translateY: this.state.logNativeOffset.y.interpolate({
              inputRange: [-1, 1],
              outputRange: [1, -1],
            }),
          },
        ],
      },
    ]);
  };

  _onChange = (e, key) => {
    try {
      const isBoolean = typeof this.state[key] === "boolean";
      this.setState({
        [key]: isBoolean ? e.nativeEvent.value : JSON.parse(e.nativeEvent.text),
      });
      this._log(`Property ${key} updated!`);
    } catch {
      this._log("JSON parse error");
    }
  };

  _log = (d) => {
    this.setState({ log: this.state.log + d + "\n" });
  };

  _clearLog = () => this.setState({ log: "Log View\n" });

  Row = (props) => (
    <View style={rs.row}>
      <Text style={rs.title}>{props.title}</Text>
      {props.isInput ? (
        <TextInput
          style={rs.text}
          ref={props.inputRef}
          defaultValue={JSON.stringify(props.value)}
          onSubmitEditing={props.onChange}
        />
      ) : (
        <Switch value={props.value} onChange={props.onChange} />
      )}
      <View style={rs.line} />
    </View>
  );

  SmallButton = (props) => (
    <TouchableOpacity {...props}>
      <Text style={cs.st}>{props.text}</Text>
    </TouchableOpacity>
  );
  //#endregion
}

//#region styles
const absCenterGray = {
  position: "absolute",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "gray",
};

const shadow = {
  shadowOffset: { width: 5, height: 5 },
  shadowColor: "rgb(94,133,241)",
  shadowOpacity: 0.5,
  elevation: 10,
};

const small = {
  ...shadow,
  ...absCenterGray,
  width: 20,
  height: 20,
  borderRadius: 20,
  backgroundColor: "rgb(94,133,241)",
};
const cs = StyleSheet.create({
  container: { backgroundColor: "#EEE" },
  content: { padding: 15, flexShrink: 1 },
  main: {
    flex: 1,
    padding: 25,
  },
  mainScroll: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "lightgray",
  },
  increaseWidth: {
    ...small,
    right: 0,
    top: "53%",
  },
  increaseHeight: {
    ...small,
    left: "53%",
    bottom: 0,
  },
  reduceWidth: {
    ...small,
    top: "53%",
    left: 0,
  },
  reduceHeight: {
    ...small,
    left: "53%",
    top: 0,
  },
  st: {
    marginBottom: Platform.select({ ios: 1, android: 5 }),
    color: "white",
  },
  tips: {
    margin: 20,
    fontSize: 25,
  },
  log: {
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    height: 120,
    padding: 10,
    backgroundColor: "lightgray",
  },
  clear: {
    ...shadow,
    ...absCenterGray,
    right: 5,
    top: 5,
    width: 44,
    height: 44,
    borderRadius: 44,
    backgroundColor: "rgb(94,133,241)",
  },
  clearText: { fontSize: 10, color: "white", textAlign: "center" },
  inverted: { transform: [{ scaleY: -1 }] },
});

const rs = StyleSheet.create({
  row: {
    height: 40,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { fontSize: 12 },
  text: { fontSize: 12 },
  line: {
    position: "absolute",
    height: 1,
    bottom: 0,
    left: 15,
    right: 15,
    backgroundColor: "gray",
  },
});
//#endregion
const tips =
  'Click the green button whose text is "+"' +
  ' or "-" to test onContentSizeChange.\n\nClick Begin Refresh button ' +
  "on the top of the main SpringScrollView to test beginRefresh.\n\n" +
  "Modify the property in the main SpringScrollView to test basic props.\n\n" +
  "Check out the event log in the LogView below.\n\n" +
  "The SpringScrollView which is scrolling should be the target of the" +
  " scroll event first.\n\n" +
  "Then child SpringScrollView should be the target of the scroll event first" +
  " unless the child's contentOffset hit the edge of the container.\n\n";
