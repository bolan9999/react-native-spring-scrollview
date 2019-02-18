# **React Native Spring ScrollView**！

**React Native Spring ScrollView V2** 是原生桥接实现的一组高性能弹性ScrollView，
使用它可以轻松地实现iOS风格的下拉刷新及上拉加载更多，
拥有完全一致的视图表现及原生的弹性体验，并且兼容iOS和Android。
V2版本弃用了React-Native-Gesture-Handler, 采用原生桥接的方式，
已经彻底解决了V1版本有时候JavaScript线程卡住造成无法弹回初始位置的问题

### 功能特性

* 跨平台（iOS & Android）的弹性ScrollView
* 支持水平和垂直方向同时滑动
* 媲美原生的滑动体验
* 高度自定义的下拉刷新和上拉加载更多动画，库内集成几种常用的刷新和加载控件.全力支持`react-native-lottie`，支持更顺滑地控制动画进度。
* 支持输入框防遮挡
* 支持滑动到指定位置
* 支持根据滑动偏移自定义原生驱动动画（水平方向和垂直方向同时）
* 支持初始化偏移
* 根本上解决了onRefresh和onLoading在某些时候没有响应的问题

### 预览
![Preview](../res/LottieRefreshing.gif)
![Preview](../res/LottieLoading.gif)
