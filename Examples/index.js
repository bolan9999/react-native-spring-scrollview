/*
 *
 * Created by Stone
 * https://github.com/bolan9999
 * Email: shanshang130@gmail.com
 * Date: 2018/7/4
 *
 */

import React from "react";
import { Button, StyleSheet, View } from "react-native";
import { InputExample } from "./InputExample";
import {ComplexExample} from "./ComplexExample";

export class Examples extends React.Component {
  constructor(props) {
    super(props);
    this.state = { select: 0 };
  }

  render() {
    switch (this.state.select) {
      case 0:
        return this._renderSelect();
      case 1:
        return <InputExample />;

      case 10:
        return <ComplexExample/>;
    }
  }

  _renderSelect() {
    return (
      <View style={styles.container}>
        <Button
          onPress={() => this.setState({ select: 1 })}
          title="InputExample"
        />

        <Button
          onPress={() => this.setState({ select: 10 })}
          title="ComplexExample"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
