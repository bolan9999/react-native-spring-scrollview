<!--
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2020-11-05 10:44:46
 * @LastEditTime: 2021-08-10 17:15:23
 * @LastEditors: 石破天惊
 * @Description: 
-->
**React Native Spring ScrollView**！

**React Native Spring ScrollView** is a high performance cross-platform  native bounces ScrollView for React Native.(iOS & Android) It is easy to support pulling to refresh and dragging to load more data. It is bridged from Native after V2.

### Features

* High performance cross-platform  native bounces ScrollView (iOS & Android)
* Simultaneous gesture on both horizontal and vertical directions.
* Smoothly scroll
* Highly customizing refreshing and loading animation. Fully support `react-native-lottie` process with `useNativeDriver`.
* Solved the common problem of views that need to move out of the way of the virtual keyboard.
* Native onScroll contentOffset on both horizontal and vertical directions
* Resolved no response with onRefresh and onLoading in some special case.
* PagingEnabled on both horizontal and vertical directions.(<font color=red>New</font>)
* Nested self like iOS.  (<font color=red>New</font>)

### Documentation
Check out our dedicated documentation page for info about this library, API reference and more:
[Documentation Reference](https://bolan9999.github.io/react-native-spring-scrollview/#/)


### Preview
![Preview](../res/android-test.gif)


### What's New in V3?

1. Support `pagingEnabled`，and `pageSize` can be configured.
2. Nested with self.
3. Support refresh programally : `beginRefresh`
4. Support react-native 0.60+
5. Fix `inverted` bug in some android sdks.
6. `tapToHideKeyboard` was depreciated，support `dragToHideKeyboard`
7. `endLoading` can configure whether it should be rebound.
8. `onScroll`修改为和官方一致，`SpringScrollView`支持`Animated.createAnimatedComponent`，并且`onScroll`支持`react-native-reanimated`
9. Fix warnnings
10. Enhance the sliding experience, optimize more details on Android。