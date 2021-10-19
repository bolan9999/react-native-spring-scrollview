<!--
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2021-07-23 23:43:47
 * @LastEditTime: 2021-07-23 23:52:14
 * @LastEditors: 石破天惊
 * @Description: 
-->
# Simple Usage

Import：
```$js
import { SpringScrollView } from "react-native-spring-scrollview";
```

Check weather the installation is correct with the code below. View  [Examples](https://github.com/bolan9999/react-native-spring-scrollview/tree/master/Examples) for more details.

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
