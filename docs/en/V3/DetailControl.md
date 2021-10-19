# 细节控制

属性  |  类型  |  默认值  |  作用  
---- | ------ | --------- | --------
decelerationRate | number | 0.998 | 在内容视图内松开手指，减速滑动的阻尼系数，单位是每毫秒百分比
decelerationRateWhenOut | number | 0.9 | 超出内容视图以后松开手指，减速滑动的阻尼系数，单位是每毫秒百分比
dampingCoefficient | number | 0.5 | 超出内容视图以后，继续滑动的阻尼系数，单位是百分比
reboundEasing | (value: number) => number | Easing.cos | 超出内容视图松开手指完成减速以后的回弹动画函数
reboundDuration | number | 300 | 回弹的时间
getNativeOffset | (offset: Animated.Value) => any | ()=>null | 获得监听滑动偏移并支持原生动画的动画值（该值是合成值，不可监听，不可修改，只能用于原生动画，并且在[处理键盘遮挡](TextInput)的偏移中，该值不会改变）
indicatorDismissTimeInterval | number | 3000 | LargeList滚动停止后指示器衰弱隐藏的时间间隔，单位毫秒
