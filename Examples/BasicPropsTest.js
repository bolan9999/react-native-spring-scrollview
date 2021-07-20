/*
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2021-07-16 17:29:37
 * @LastEditTime: 2021-07-20 17:15:23
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
} from 'react-native';
import {SpringScrollView} from '../src/SpringScrollView';

export class BasicPropsTest extends React.Component {
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
    style: {backgroundColor: 'gray'},
    contentStyle: {height: 2000},
    pageSize: {width: 200, height: 200},

    //do not in property
    log: 'Log View\n',
  };
  render() {
    const propertyKeys = Object.keys(this.state).filter(
      (key, index) =>
        index < Object.keys(this.state).findIndex((v) => v === 'log'),
    );
    return (
      <SpringScrollView style={cs.container} contentStyle={cs.content}>
        <SpringScrollView
          {...this.state}
          ref={(ref) => (this._main = ref)}
          onTouchBegin={this._onTouchBegin}
          onTouchEnd={this._onTouchEnd}
          onMomentumScrollBegin={this.onMomentumScrollBegin}
          onMomentumScrollEnd={this._onMomentumScrollEnd}
          onScrollBeginDrag={this._onScrollBeginDrag}
          onScrollEndDrag={this._onScrollEndDrag}
          onNativeContentOffsetExtract={this._nativeOffset}>
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
        <SpringScrollView style={cs.log} inverted>
          <Text style={cs.inverted}>{this.state.log}</Text>
        </SpringScrollView>
      </SpringScrollView>
    );
  }

  // #region 基本事件响应函数
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
  // #endregion

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

//#region styles
const cs = StyleSheet.create({
  container: {backgroundColor: '#EEE'},
  content: {padding: 40, flexShrink: 1},
  log: {height: 180, backgroundColor: 'lightgray'},
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
  title: {fontSize: 14},
  text: {fontSize: 14},
  line: {
    position: 'absolute',
    height: 1,
    bottom: 0,
    left: 15,
    right: 15,
    backgroundColor: 'lightgray',
  },
});
//#endregion
