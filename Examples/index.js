/*
 *
 * Created by Stone
 * https://github.com/bolan9999
 * Email: shanshang130@gmail.com
 * Date: 2018/7/4
 *
 */

import React from "react";
import { Button, StyleSheet, View, SafeAreaView } from "react-native";
import { InputExample } from "./InputExample";
import { ComplexExample } from "./ComplexExample";
import { BouncesAndScrollEnabledExample } from "./BouncesAndScrollEnabledExample";
import { RefreshAndLoadingExample } from "./RefreshAndLoadingExample";
import { ScrollToAndOnScrollExample } from "./ScrollToAndOnScrollExample";
import {Test} from "./Test";

export class Examples extends React.Component {
  constructor(props) {
    super(props);
    this.state = { select: 0 };
  }

  render(){
    return <SafeAreaView style={styles.container}>
      {this._renderContent()}
    </SafeAreaView>
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
    }
  }

  _renderSelect() {
    return (
      <View style={styles.container}>
        <Button
          onPress={() => this.setState({ select: 1 })}
          title="Test"
        />

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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  }
});
