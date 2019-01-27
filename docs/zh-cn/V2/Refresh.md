# 下拉刷新

### 预览
![Preview](../../res/RefreshingStickyContent.gif)

### 导入

```$js
import { SpringScrollView } from "react-native-spring-scrollview";
import { ChineseWithLastDateHeader } from "react-native-spring-scrollview/Customize";
```

使用SpringScrollView可以非常简单地实现下拉刷新的功能, 本库默认提供了一个NormalHeader类供用户使用(在[Customize](https://github.com/bolan9999/react-native-spring-scrollview/tree/master/src/Customize)目录下有提供其他比较常用的下拉刷新组件),中文用户推荐使用ChineseWithLastDateHeader

### Simple Example

```$js
<SpringScrollView
  ref={ref => (this._scrollView = ref)}
  refreshHeader={ChineseWithLastDateHeader}
  onRefresh={()=>{
    setTimeOut(()=>{
      this._scrollView.endRefresh();
      setTimeOut(()=>this.setState({prop:"your changed props"}));
    },2000);
  }
    <Text>
      This is a Normal Refresh Test
    </Text>
</SpringScrollView>
```

属性  |  类型  |  默认值  |  作用  
---- | ------ | --------- | --------
onRefresh | ()=>any | undefined | 下拉刷新的回调函数,如果设置了此属性，则会在顶部加一个刷新Header
refreshHeader | [RefreshHeader](https://github.com/bolan9999/react-native-spring-scrollview/blob/master/src/RefreshHeader.js) | NormalHeader | 选择下拉刷新的组件，用户如果不希望高度自定义，则可以不设定直接使用NormalHeader,如果需要高度自定义，请参看[自定义下拉刷新](zh-cn/V2/CustomRefresh)


**请注意，V2版本取消了refreshHeaderHeight属性，想要自定义刷新组件的高度，请查看[自定义下拉刷新](zh-cn/V2/CustomRefresh)下的[自定义高度](zh-cn/V2/CustomRefresh?id=自定义刷新组件的高度)**


### 方法

### endRefresh()

结束刷新，关闭刷新组件。 在onRefresh完成数据请求以后，我们建议您先使用此方法开启结束动画，再更新内容，这样在下拉过程中，动画更流畅（ **注意：V2版本已经取消了beginRefresh过程，组件会自动开始刷新** ）

### 本库提供的额外刷新控件

本库提供了一些刷新控件, 用户可以试试
```
import {NormalRefresh} from "react-native-spring-scrollview/NormalRefresh";
import {
    WithLastDateHeader,
    ChineseNormalHeader,
    ChineseWithLastDateHeader,
} from "react-native-spring-scrollview/Customize";
```
