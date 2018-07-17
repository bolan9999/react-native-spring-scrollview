### 概述

VerticalScrollView是一个支持竖直方向滑动的弹性ScrollView，和官方的ScrollView一样，简单粗暴地将所有内容一次性渲染出来，特别适合少量可滑动内容界面。

与官方的ScrollView一样，VerticalScrollView必须有一个确定的高度才能正常工作，因为它实际上所做的就是将一系列不确定高度的子组件装进一个确定高度的容器（通过滚动操作）。要给一个ScrollView确定一个高度的话，要么直接给它设置高度（不建议），要么确定所有的父容器都有确定的高度。一般来说我们会给ScrollView设置flex: 1以使其自动填充父容器的空余空间，但前提条件是所有的父容器本身也设置了flex或者指定了高度，否则就会导致无法正常滚动，你可以使用元素查看器来查找问题的原因。

### style & contentStyle

VerticalScrollView和官方的ScrollView一样, 由两个组件组成. style控制外层包裹视图的样式， contentStyle控制内层视图的样式。不一样的地方在于，官方的ScrollView 内层视图默认拥有以下样式：

```$js
flexGrow: 1,
flexShrink: 1,
flexDirection: 'column',
overflow: 'scroll',
```

并且这些属性都不可修改，VerticalScrollView则更自由，允许你自定义所有样式(除了transform属性，该属性已经用于滑动动画)。


这意味着你可以轻松实现官方ScrollView 安卓上无法实现的contentInset，contentOffset，indicatorStyle，scrollIndicatorInsets等功能

