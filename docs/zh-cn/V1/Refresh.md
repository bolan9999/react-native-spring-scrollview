# 下拉刷新

### 预览
![Preview](../res/RefreshAndroid.gif)
![Preview](../res/RefreshIOS.gif)

### 代码

导入

```$js
import { VerticalScrollView } from "react-native-spring-scrollview";
import { NormalHeader } from "react-native-spring-scrollview/NormalHeader";
```

使用VerticalScrollView可以非常简单地实现下拉刷新的功能, 本库默认提供了一个NormalHeader类供用户使用

```$js
<VerticalScrollView
  ref={ref => (this._scrollView = ref)}
  style={styles.container}
  refreshHeaderHeight={60}
  refreshHeader={NormalHeader}
  onRefresh={()=>{
    this._scrollView.beginRefresh();
    setTimeOut(()=>{
      this._scrollView.endRefresh();
      setTimeOut(()=>this.setState({prop:"your changed props"}));
    },2000);
  }
  onCancelRefresh={()=>{
    console.log("当下拉刷新，但是用户主动回拉取消时回调");
  }>
    <Text key={item} style={styles.text}>
      This is a Normal Refresh and Loading Test
    </Text>
  </VerticalScrollView>
```


### 属性

#### refreshHeaderHeight

类型：number

默认值： 80

描述：下拉刷新组件的高度

#### refreshHeader

类型：RefreshHeader

默认值： undefined

描述：下拉刷新组件，用户如果不希望高度自定义，则可以使用NormalHeader,如果需要高度自定义，请参看[自定义下拉刷新](CustomRefresh)

#### onRefresh

类型：()=>any

默认值：()=>null

描述：下拉刷新的回调函数

#### onCancelRefresh

类型：()=>any

默认值：()=>null

描述：触发下拉刷新回调以后，在刷新的过程中，用户可以回拉取消刷新，如果你希望在此回调，则可以在此做您的操作。

### 方法

#### beginRefresh()

开始刷新，弹出（或回弹）刷新组件

### endRefresh()

结束刷新，关闭刷新组件。 在onRefresh完成数据请求以后，我们建议您先使用此方法开启结束动画，再setTimeout更新内容，这样在下拉过程中，动画更流畅

