# Simple Usage

Import：
```$js
import { SpringScrollView } from "react-native-spring-scrollview";
```

Check weather the installation is correct with the code below. See  [Examples](https://github.com/bolan9999/react-native-spring-scrollview/tree/master/Examples) for more details.

```$js
export class BouncesAndScrollEnabledExample extends React.Component {
  _contentCount = 20;
  render() {
    const arr = [];
    for (let i = 0; i < this._contentCount; ++i) arr.push(i);
    return (
      <SpringScrollView>
        {arr.map((i, index) =>
          <Text key={index} style={styles.text}>
            Modify the '_contentCount','_bounces' and '_scrollEnabled' in
            BouncesExample.js to check if VerticalScrollView works well.
          </Text>
        )}
      </VerticalScrollView>
    );
  }
}
const styles = StyleSheet.create({
  text:{
    fontSize:16,
    margin:20
  }
});
```
