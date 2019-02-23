# 基本控制


属性  |  类型  |  默认值  |  作用  
---- | ------ | --------- | --------
...ViewProps | - | | View的所有属性
bounces | boolean | true | 滑动超出内容视图后是否可以弹性地继续滑动(iOS & Android，如果为true，水平方向内容视图如果没有超过SpringScrollView则不会有弹性，垂直方向始终具有弹性）
contentStyle | ViewStyle | undefined | 内容视图的样式。注意：transform无效
scrollEnabled | boolean | true | 是否可以滚动
directionalLockEnabled | boolean | false | 支持双向滑动的情况下，控制一次滑动只允许水平或垂直一个方向。
initialContentOffset | {x:number, y:number} | undefined | 初始化偏移，仅第一次初始化有效，后期更改无效（已支持x方向）
showsVerticalScrollIndicator | boolean | true | 显示垂直滚动指示器
showsHorizontalScrollIndicator | boolean | true | 显示水平滚动指示器（内容视图超出SpringScrollview视口才有用）
tapToHideKeyboard | boolean | true | 点击SpringScrollView是否收起键盘
onSizeChange | ({width:number,height:number})=>any | undefined | 外部Wrapper视图宽高变化时回调
onContentSizeChange | ({width:number,height:number})=>any | undefined | 内部ContentView视图宽高变化时回调
inverted | boolean | false | 将SpringScrollView上下翻转，此属性单独意义不大，主要是为了LargeList提供功能

