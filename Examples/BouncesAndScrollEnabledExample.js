/*
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2021-07-21 13:05:32
 * @LastEditTime: 2021-09-18 10:39:36
 * @LastEditors: 石破天惊
 * @Description: 
 */
/*
 *
 * Created by Stone
 * https://github.com/bolan9999
 * Email: shanshang130@gmail.com
 * Date: 2018/7/15
 *
 */

import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SpringScrollView} from '../src';

export class BouncesAndScrollEnabledExample extends React.Component {
  state = {
    contentCount: 100,
    bounces: true,
    scrollEnabled: true,
    showsVerticalScrollIndicator: true,
  };

  render() {
    const arr = [];
    for (let i = 0; i < this.state.contentCount; ++i) arr.push(i);
    return (
      <SpringScrollView
        {...this.state}
        directionalLockEnabled
        contentStyle={{width: '300%', backgroundColor: 'lightgray'}}
        initialContentOffset={{x: 0, y: 550}}>
        {arr.map((i, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              this.setState((p) => ({
                contentCount: p.contentCount === 1 ? 100 : 1,
              }));
            }}>
            <Text style={styles.text}>
              Modify the 'contentCount','bounces' and 'scrollEnabled' state in
              BouncesExample.js to check if VerticalScrollView works well.
            </Text>
          </TouchableOpacity>
        ))}
      </SpringScrollView>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    margin: 20,
  },
});
