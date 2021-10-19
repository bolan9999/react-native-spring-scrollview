/*
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2021-07-21 13:05:32
 * @LastEditTime: 2021-10-19 16:28:57
 * @LastEditors: 石破天惊
 * @Description:
 */
/*
 *
 * Created by Stone
 * https://github.com/bolan9999
 * Email: shanshang130@gmail.com
 * Date: 2018/7/4
 *
 */

import React from "react";
import { Button, StyleSheet, View, SafeAreaView, Platform } from "react-native";
import { InputExample } from "./InputExample";
import { ComplexExample } from "./ComplexExample";
import { BouncesAndScrollEnabledExample } from "./BouncesAndScrollEnabledExample";
import { RefreshAndLoadingExample } from "./RefreshAndLoadingExample";
import { ScrollToAndOnScrollExample } from "./ScrollToAndOnScrollExample";
import { Test } from "./Test";
import { CrossHeaderTabExample } from "./CrossHeaderTabExample";
import { ChildrenTest } from "./ChildrenTest";

export class Examples extends React.Component {
  constructor(props) {
    super(props);
    this.state = { select: 0 };
  }

  render() {
    return this._renderContent();
  }

  _renderContent() {
    switch (this.state.select) {
      case 0:
        return this._renderSelect();
      case 1:
        return <Test />;
      case 2:
        return <BouncesAndScrollEnabledExample />;

      case 3:
        return <RefreshAndLoadingExample />;
      case 4:
        return <ComplexExample />;
      case 5:
        return <ScrollToAndOnScrollExample />;
      case 6:
        return <CrossHeaderTabExample />;
      case 7:
        return <ChildrenTest />;
    }
  }

  _renderSelect() {
    return (
      <View style={styles.container}>
        <Button onPress={() => this.setState({ select: 1 })} title="Test" />

        <Button
          onPress={() => this.setState({ select: 2 })}
          title="BouncesAndScrollEnabledExample"
        />

        <Button
          onPress={() => this.setState({ select: 3 })}
          title="RefreshAndLoadingExample"
        />

        <Button
          onPress={() => this.setState({ select: 4 })}
          title="ComplexExample"
        />
        <Button
          onPress={() => this.setState({ select: 5 })}
          title="ScrollToAndOnScrollExample"
        />
        <Button
          onPress={() => this.setState({ select: 6 })}
          title="CrossHeaderTabExample"
        />
        <Button
          onPress={() => this.setState({ select: 7 })}
          title="ChildrenTest"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.select({ android: 50 }),
    backgroundColor: "white",
  },
});
