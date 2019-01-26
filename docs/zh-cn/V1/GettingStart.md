# 快速接入

该项目依赖 [react-native-gesture-handler](https://github.com/kmagiera/react-native-gesture-handler), 在接入本库之前请先阅读[react-native-gesture-handler接入文档](https://kmagiera.github.io/react-native-gesture-handler/docs/getting-started.html#installation)正确接入react-native-gesture-handler

### 接入[react-native-gesture-handler](https://github.com/kmagiera/react-native-gesture-handler)
大概步骤就是：
```$node
yarn add react-native-gesture-handler
react-native link react-native-gesture-handler
```
使用包装后的组件替代您的ScreenComponent
```$js
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'

class YourScreen extends React.Component{
    //...
};

export const YourScreenWrapper = gestureHandlerRootHOC(YourScreen);
```
在任何地方使用YourScreenWrapper替代YourScreen

到此，[react-native-gesture-handler](https://github.com/kmagiera/react-native-gesture-handler)就已经安装完成。

### 接入[react-native-spring-scrollview](https://github.com/bolan9999/react-native-spring-scrollview)

接下来使用下面命令安装react-native-spring-scrollview

```$node
yarn add react-native-spring-scrollview
```



