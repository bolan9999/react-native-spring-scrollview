<!--
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2020-11-05 10:44:46
 * @LastEditTime: 2021-07-23 23:41:40
 * @LastEditors: 石破天惊
 * @Description: 
-->
# **React Native Spring ScrollView**！

**React Native Spring ScrollView V3** 是原生桥接实现的一组高性能弹性ScrollView，
使用它可以轻松地实现iOS风格的下拉刷新及上拉加载更多，
拥有完全一致的视图表现及原生的弹性体验，并且兼容iOS和Android。
V2版本弃用了React-Native-Gesture-Handler, 采用原生桥接的方式，
已经彻底解决了V1版本有时候JavaScript线程卡住造成无法弹回初始位置的问题。
V3版本在V2的基础上做了小幅调整，修复了一系列问题。

### 功能特性

* 跨平台（iOS & Android）的弹性ScrollView
* 支持水平和垂直方向同时滑动
* 媲美原生的滑动体验
* 高度自定义的下拉刷新和上拉加载更多动画，库内集成几种常用的刷新和加载控件.全力支持`react-native-lottie`，支持更顺滑地控制动画进度。
* 支持输入框防遮挡
* 支持根据滑动偏移自定义原生驱动动画（水平方向和垂直方向同时）
* 根本上解决了onRefresh和onLoading在某些时候没有响应的问题
* 支持水平和垂直方向分页。(<font color=red>新功能</font>)
* 安卓和iOS上均可自由嵌套。(<font color=red>新功能</font>)

### 预览
![Preview](../res/android-test.gif)

### V3更新了什么？

全新版本3.0，对于V2做了以下修改：
1. 支持`pagingEnabled`，并且可配置单页面宽高
2. 修复安卓上自嵌套的问题，并能够于原生ScrollView完成嵌套
3. 支持主动刷新`beginRefresh`
4. 全面支持react-native 0.60+
5. 安卓上超出`SpringScrollView`视口范围的拖拽阻尼系数由0.8二次函数渐变到0.5修改为固定0.5
6. 修正inverted在某些android sdk版本上存在滑动方向错误的问题
7. `tapToHideKeyboard`属性取消，修改为支持`dragToHideKeyboard`
8. `endLoading`修改为不回弹，但可以通过修改参数完成回弹操作
9. `onScroll`修改为和官方一致，`SpringScrollView`支持`Animated.createAnimatedComponent`，并且`onScroll`支持`react-native-reanimated`
10. AsnycStorage导入修改，适配新版本，消除各种警告
11. 增强了滑动体验，细节优化更多。
