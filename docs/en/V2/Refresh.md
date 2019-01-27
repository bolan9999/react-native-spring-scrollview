# Pull to refresh

### Preview
![Preview](../../res/RefreshingStickyContent.gif)

### Import

```$js
import { SpringScrollView } from "react-native-spring-scrollview";
import { NormalHeader } from "react-native-spring-scrollview/NormalHeader";
```

It is easy to support pulling to refresh with SpringScrollView. This library offers a `NormalHeader` for you. And you can try other refresh headers in the [Customize](https://github.com/bolan9999/react-native-spring-scrollview/tree/master/src/Customize) dir.

### Simple Example

```$js
<SpringScrollView
  ref={ref => (this._scrollView = ref)}
  refreshHeader={ChineseWithLastDateHeader}
  onRefresh={()=>{
    setTimeOut(()=>{
      this._scrollView.endRefresh();
      this.setState(...);
    },2000);
  }
    <Text>
      This is a Normal Refresh Test
    </Text>
</SpringScrollView>
```

Props  |  Type  |  Default  |  description  
---- | ------ | --------- | --------
onRefresh | ()=>any | undefined | The callback when refreshing. When this props is configured, a refresh header will be add on the top of the SpringScrollView
refreshHeader | [RefreshHeader](https://github.com/bolan9999/react-native-spring-scrollview/blob/master/src/RefreshHeader.js) | NormalHeader | Select a refreshing header , The headers in the [Customize](https://github.com/bolan9999/react-native-spring-scrollview/tree/master/src/Customize) dir are all supported


**Precautions:** refreshHeaderHeight is not supported after V2. If you want to customize the height of the refreshing header. View [Customize the refreshing header height](en/V2/CustomRefresh?id=自定义刷新组件的高度) below [custom refreshing](en/V2/CustomRefresh) please.


### Methods

### endRefresh()

End the refreshing status.

### All refreshing headers in this library

```
import {NormalRefresh} from "react-native-spring-scrollview/NormalRefresh";
import {
    WithLastDateHeader,
    ChineseNormalHeader,
    ChineseWithLastDateHeader,
} from "react-native-spring-scrollview/Customize";
```
