/*
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2021-07-16 17:29:37
 * @LastEditTime: 2021-07-20 10:49:41
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
      (key, index) => index < Object.keys(this.state).findIndex((v) => v==='log'),
    );
    return (
      <SpringScrollView
        style={{backgroundColor: '#EEE'}}
        contentStyle={{paddingHorizontal: 40, flexShrink: 1}}>
        <SpringScrollView
          {...this.state}
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
        <SpringScrollView style={cs.log}>
          <Text>{this.state.log}</Text>
        </SpringScrollView>
      </SpringScrollView>
    );
  }

  _onTouchBegin = () => {
    console.log('onTouchBegin');
  };

  _onTouchEnd = () => {
    console.log('onTouchEnd');
  };

  onMomentumScrollBegin = () => {
    console.log('onMomentumScrollBegin');
  };
  _onMomentumScrollEnd = () => {
    console.log('onMomentumScrollEnd');
  };

  _onScrollBeginDrag = () => {
    console.log('onScrollBeginDrag');
  };

  _onScrollEndDrag = () => {
    console.log('onScrollEndDrag');
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

const cs = StyleSheet.create({
  log: {height: 180, backgroundColor: 'lightgray'},
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
