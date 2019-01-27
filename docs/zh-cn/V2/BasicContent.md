### 概述

SpringScrollView是一个支持水平竖直方向同时滑动的弹性ScrollView，和官方的ScrollView一样，简单粗暴地将所有内容一次性渲染出来，特别适合少量可滑动内容界面。如果您想要一个支持重用的大列表组件，也许[LargeList](https://bolan9999.github.io/react-native-largelist/#/)是个不错的选择。

与官方的ScrollView一样，SpringScrollView必须有一个确定的高度才能正常工作，因为它实际上所做的就是将一系列不确定高度的子组件装进一个确定高度的容器（通过滚动操作）。SpringScrollView默认具有{flex:1}的样式，因此要使SpringScrollView正常工作，它的父容器必须是确定高度的，你也可以通过手动指定样式，使之正常工作。

### style & contentStyle

SpringScrollView和官方的ScrollView一样, 由两个组件组成. style控制外层包裹视图的样式， contentStyle控制内层视图的样式。不一样的地方在于，官方的ScrollView 内层视图默认拥有以下样式：

```$js
flexGrow: 1,
flexShrink: 1,
flexDirection: 'column',
overflow: 'scroll',
```

并且这些属性都不可修改，VerticalScrollView默认contentStyle是View的通用默认样式`{flexDirection:"column",justifyContent:"stretch"}`，并且它更自由，允许你自定义几乎所有样式(除了transform属性，该属性已经用于滑动动画)。

属性  |  类型  |  默认值  |  作用  
---- | ------ | --------- | --------
style | Animated.[ViewStyle](http://facebook.github.io/react-native/docs/view-style-props) | {flex:1} | 控制外层容器样式,直接支持Animated样式
contentStyle | [ViewStyle](http://facebook.github.io/react-native/docs/view-style-props) | - | 控制内层内容视图的样式

注意：V2版本SpringScrollView已经支持水平垂直方向同时滑动了，contentStyle可以支持{width:"200%"}等宽度超过父元素的样式
