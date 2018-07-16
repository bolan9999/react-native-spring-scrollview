# 快速接入

该项目依赖 [react-native-gesture-handler](https://github.com/kmagiera/react-native-gesture-handler), 在接入本库之前请先阅读[react-native-gesture-handler接入文档](https://kmagiera.github.io/react-native-gesture-handler/docs/getting-started.html#installation)正确接入react-native-gesture-handler

### 接入[react-native-gesture-handler](https://github.com/kmagiera/react-native-gesture-handler)
大概步骤就是：
```$node
yarn add react-native-gesture-handler
react-native link react-native-gesture-handler
```

如果不是是用native-navigation或者react-native-navigation则可以直接修改安卓代码

```$java
package com.swmansion.gesturehandler.react.example;

import com.facebook.react.ReactActivity;
// 添加这些到项目
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
// ============

public class MainActivity extends ReactActivity {

  @Override
  protected String getMainComponentName() {
    return "Example";
  }

// 添加这些到项目
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
       return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }
// =============
}
```
iOS则不用修改。

如果是使用native-navigation或者react-native-navigation，需要修改JavaScript代码

```$js
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import { Navigation } from 'react-native-navigation';
import YourScreen from './YourScreen';

export function registerScreens() {
  Navigation.registerComponent('example.FirstTabScreen', () =>
    gestureHandlerRootHOC(YourScreen));
}
```

到此，[react-native-gesture-handler](https://github.com/kmagiera/react-native-gesture-handler)就已经安装完成。

### 接入[react-native-spring-scrollview](https://github.com/bolan9999/react-native-spring-scrollview)

接下来使用下面命令安装react-native-spring-scrollview

```$node
yarn add react-native-spring-scrollview
```



