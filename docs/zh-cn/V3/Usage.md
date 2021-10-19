# 简单使用

导入：
```$js
import { SpringScrollView } from "react-native-spring-scrollview";
```

使用下面的JS代码检查是否接入成功, 详见 [Examples](https://github.com/bolan9999/react-native-spring-scrollview/tree/master/Examples)

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
