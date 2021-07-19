/*
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2021-07-16 17:29:37
 * @LastEditTime: 2021-07-19 10:09:47
 * @LastEditors: 石破天惊
 * @Description:
 */

import React from 'react';
import {StyleSheet, Switch, TextInput, View, Text, ScrollView} from 'react-native';
import {SpringScrollView} from '../src/SpringScrollView';

export class BasicPropsTest extends React.Component {
  state = {
    style: {flex:1},
    bounces: true,
    contentStyle: {flexGrow: 1, height: 2000},
    scrollEnabled: true,
    directionalLockEnabled: true,
    showsVerticalScrollIndicator: true,
    showsHorizontalScrollIndicator: true,
    dragToHideKeyboard: true,
    inverted: false,
  };
  render() {
    return (
      <SpringScrollView
        {...this.state}
        pagingEnabled
        snapToInterval={200}
        snapToAlignment="start"
        decelerationRate={0.99}
        contentContainerStyle= {{ height: 10000}}
        >
        {Object.keys(this.state).map((key) => (
          <Row
            key={key}
            title={key}
            isInput={typeof this.state[key] !== 'boolean'}
            value={this.state[key]}
            onChange={(e) =>
              this.setState({
                [key]:
                  typeof this.state[key] === 'boolean'
                    ? e.nativeEvent.value
                    : JSON.parse(e.nativeEvent.text),
              })
            }
          />
        ))}
      </SpringScrollView>
    );
  }
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

const rs = StyleSheet.create({
  row: {
    height: 50,
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
