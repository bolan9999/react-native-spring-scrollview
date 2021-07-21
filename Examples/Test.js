/*
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2021-07-16 17:29:37
 * @LastEditTime: 2021-07-21 10:57:20
 * @LastEditors: 石破天惊
 * @Description:
 */

import React from 'react';
import {
  StyleSheet,
  Switch,
  TextInput,
  View,
  Text,
  ScrollView,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {SpringScrollView} from '../src/SpringScrollView';
import {CommonLottieHeader} from '../src/Customize/CommonLottieHeader';
import {CommonLottieFooter} from '../src/Customize/CommonLottieFooter';

const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity);
export class Test extends React.Component {
  _main: SpringScrollView;
  state = {
    bounces: true,
    scrollEnabled: true,
    pagingEnabled: false,
    directionalLockEnabled: true,
    showsVerticalScrollIndicator: true,
    showsHorizontalScrollIndicator: true,
    dragToHideKeyboard: true,
    inverted: false,
    contentStyle: {width: '100%', height: '200%'},
    pageSize: {width: 200, height: 200},

    //do not in property
    log: tips,
    allLoaded: false,
    logNativeOffset: {y: new Animated.Value(0)},
  };
  render() {
    const propertyKeys = Object.keys(this.state).filter(
      (key, index) =>
        index < Object.keys(this.state).findIndex((v) => v === 'log'),
    );
    return (
      <SpringScrollView style={cs.container} contentStyle={cs.content}>
        <View style={cs.main}>
          <SpringScrollView
            {...this.state}
            ref={(ref) => (this._main = ref)}
            onScroll={this._onScroll}
            onTouchBegin={this._onTouchBegin}
            onTouchEnd={this._onTouchEnd}
            onMomentumScrollBegin={this.onMomentumScrollBegin}
            onMomentumScrollEnd={this._onMomentumScrollEnd}
            onScrollBeginDrag={this._onScrollBeginDrag}
            onScrollEndDrag={this._onScrollEndDrag}
            onSizeChange={this._onSizeChange}
            onContentSizeChange={this._onContentSizeChange}
            onRefresh={this._onRefresh}
            onLoading={this._onLoading}
            allLoaded={this.state.allLoaded}
            refreshHeader={CommonLottieHeader}
            loadingFooter={CommonLottieFooter}>
            {propertyKeys.map((key) => (
              <Row
                key={key}
                title={key}
                isInput={typeof this.state[key] !== 'boolean'}
                value={this.state[key]}
                onChange={(e) => this._onChange(e, key)}
              />
            ))}
          </SpringScrollView>
          <TouchableOpacity
            style={cs.increaseWidth}
            onPress={this._onIncreaseWidth}>
            <Text>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={cs.increaseHeight}
            onPress={this._onIncreaseHeight}>
            <Text>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={cs.reduceHeight}
            onPress={this._onReduceHeight}>
            <Text>-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={cs.reduceWidth}
            onPress={this._onReduceWidth}>
            <Text>-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={cs.beginRefresh}
            onPress={this._beginRefresh}>
            <Text style={cs.clearText}>Begin Refresh</Text>
          </TouchableOpacity>
        </View>
        <View style={cs.log}>
          <SpringScrollView
            inverted
            onNativeContentOffsetExtract={this.state.logNativeOffset}>
            <Text style={cs.inverted}>{this.state.log}</Text>
            <AnimatedButton
              style={this._getClearButtonStyle()}
              onPress={this._clearLog}>
              <Text style={cs.clearText}>CLEAR</Text>
            </AnimatedButton>
          </SpringScrollView>
        </View>
      </SpringScrollView>
    );
  }

  //#region Test refresh and loading
  _beginRefresh = () => this._main.beginRefresh();
  _onRefresh = () => {
    this._log('Refresh start');
    setTimeout(() => {
      this._main.endRefresh();
      this._log('Refresh end');
    }, 1500);
  };

  _onLoading = () => {
    this._log('Loading start');
    setTimeout(() => {
      this._main.endLoading(true);
      this._log('Loading end');
    }, 1500);
  };
  //#endregion
  //#region Test Content Size Change
  _onSizeChange = ({width, height}) =>
    this._log(`onSizeChange width=${width} height=${height}`);
  _onContentSizeChange = ({width, height}) =>
    this._log(`onContentSizeChange width=${width} height=${height}`);

  _onIncreaseWidth = () => {
    let {width, height} = this.state.contentStyle;
    const w = parseInt(width) + 50;
    this.setState({contentStyle: {width: `${w}%`, height}});
  };

  _onIncreaseHeight = () => {
    let {width, height} = this.state.contentStyle;
    const h = parseInt(height) + 50;
    this.setState({contentStyle: {width, height: `${h}%`}});
  };

  _onReduceWidth = () => {
    let {width, height} = this.state.contentStyle;
    const w = parseInt(width) - 50;
    this.setState({contentStyle: {width: `${w}%`, height}});
  };
  _onReduceHeight = () => {
    let {width, height} = this.state.contentStyle;
    const h = parseInt(height) - 50;
    this.setState({contentStyle: {width, height: `${h}%`}});
  };
  //#endregion
  // #region Test Event
  _onTouchBegin = () => {
    this._log('onTouchBegin');
  };

  _onTouchEnd = () => {
    this._log('onTouchEnd');
  };

  onMomentumScrollBegin = () => {
    this._log('onMomentumScrollBegin');
  };
  _onMomentumScrollEnd = () => {
    this._log('onMomentumScrollEnd');
  };

  _onScrollBeginDrag = () => {
    this._log('onScrollBeginDrag');
  };

  _onScrollEndDrag = () => {
    this._log('onScrollEndDrag');
  };
  _onScroll = ({nativeEvent: {contentOffset}}) =>
    console.log('onScroll', contentOffset);
  // #endregion
  //#region Other functions
  _getClearButtonStyle = () => {
    return StyleSheet.flatten([
      cs.clear,
      {
        transform: [
          {scaleY: -1},
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
      const isBoolean = typeof this.state[key] === 'boolean';
      this.setState({
        [key]: isBoolean ? e.nativeEvent.value : JSON.parse(e.nativeEvent.text),
      });
      this._log(`Property ${key} updated!`);
    } catch {
      this._log('JSON parse error');
    }
  };

  _log = (d) => {
    this.setState({log: this.state.log + d + '\n'});
  };

  _clearLog = () => this.setState({log: 'Log View\n'});
}

const Row = (props) => (
  <View style={rs.row}>
    <Text style={rs.title}>{props.title}</Text>
    {props.isInput ? (
      <TextInput
        style={rs.text}
        defaultValue={JSON.stringify(props.value)}
        onSubmitEditing={props.onChange}
      />
    ) : (
      <Switch value={props.value} onChange={props.onChange} />
    )}
    <View style={rs.line} />
  </View>
);
//#endregion
//#region styles
const absCenterGray = {
  position: 'absolute',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'gray',
};
const cs = StyleSheet.create({
  container: {backgroundColor: '#EEE'},
  content: {padding: 40, flexShrink: 1},
  main: {
    flex: 1,
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'lightgray',
    overflow: 'hidden',
  },
  increaseWidth: {
    ...absCenterGray,
    right: 0,
    top: 0,
    width: 20,
    bottom: 0,
  },
  increaseHeight: {
    ...absCenterGray,
    right: 0,
    left: 0,
    height: 20,
    bottom: 0,
  },
  reduceWidth: {
    ...absCenterGray,
    top: 0,
    left: 0,
    width: 20,
    bottom: 0,
  },
  reduceHeight: {
    ...absCenterGray,
    right: 0,
    left: 0,
    height: 20,
    top: 0,
  },
  beginRefresh: {
    ...absCenterGray,
    right: 35,
    bottom: 35,
    width: 44,
    height: 44,
    borderRadius: 44,
    backgroundColor: 'rgb(94,133,241)',
  },
  log: {
    marginTop: 10,
    borderRadius: 10,
    height: 180,
    padding: 10,
    backgroundColor: 'lightgray',
  },
  clear: {
    ...absCenterGray,
    right: 5,
    top: 5,
    width: 44,
    height: 44,
    borderRadius: 44,
    backgroundColor: 'rgb(94,133,241)',
  },
  clearText: {fontSize: 10, color: 'white', textAlign: 'center'},
  inverted: {transform: [{scaleY: -1}]},
});

const rs = StyleSheet.create({
  row: {
    height: 40,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {fontSize: 12},
  text: {fontSize: 8},
  line: {
    position: 'absolute',
    height: 1,
    bottom: 0,
    left: 15,
    right: 15,
    backgroundColor: 'gray',
  },
});
//#endregion
const tips =
  'Log View:\n Click the gray button whose text is "+"' +
  ' or "-" to test onContentSizeChange.\n Click Begin Refresh button ' +
  'on the rightbottom of the main SpringScrollView to test beginRefresh.';
