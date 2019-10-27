# 快速接入

React Native版本推荐：

react-native@0.50以下：不确定是否支持，请自行解决原生端问题。

react-native@0.50-0.59：推荐使用react-native-spring-scrollview@2.0.* (最后一位版本号可自行去npm官方查询最新发布的版本)

react-native@0.60+：推荐使用react-native-spring-scrollview@2.1.*

### 安装

RN 0.60+：
```
yarn add react-native-spring-scrollview@2.1.0
cd YourProject/ios && pod install && cd ..
```
RN 0.50-0.59:
```
yarn add react-native-spring-scrollview@2.0.23
react-native link react-native-spring-scrollview
```

如果没有异常情况，原生端应该已经安装完成，为了稳妥起见，您还是应该手动检查原生端的链接是否正确

### 检查原生端是否链接正确(仅供2.0.*版本参考)

##### iOS
* 检查 `您的项目 ==> Libraries ==> RNSpringScrollView.xcodeproj` 是否已添加到您的项目中
* 检查 `您的项目设置 ==> TARGETS ==> BuildPhases ==> Link Binary With Libraries ==> libRNSpringScrollView.a`
是否链接到您的项目中

##### Android
* 检查`YourProject/android/settings.gradle`是否包含了如下信息
```
include ':react-native-spring-scrollview'
project(':react-native-spring-scrollview').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-spring-scrollview/android')
```

* 检查`YourProject/android/app/build.gradle`是否包含了以下信息
```
dependencies {
    compile project(':react-native-spring-scrollview')
    compile fileTree(include: ['*.jar'], dir: 'libs')
    compile 'com.android.support:appcompat-v7:26.0.0'
    compile 'com.facebook.react:react-native:+'
    // From node_modules
}
```

* 检查'MainApplication.java'是否加入了`new SpringScrollViewPackage()`
```
@Override
protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
        new SpringScrollViewPackage()
    );
}
```

### iOS常见接入问题
1. 编译找不到`RCTXXXX.h`文件：

   可以参看[这里](https://github.com/facebook/react-native/issues/22000#issuecomment-438201084)

### Android常见接入问题

1. 找不到`android/drawable/XXXXXX`, '`android/res/XXXXXX`'等文件。

检查android编译版本问题，本库编译版本是26，可以尝试修改您的版本号，或者修改本库版本号；

检查`YourProject/android/app/build.gradle`是否包含了谷歌的代码仓库
```
allprojects {
    repositories {
        mavenLocal()
        jcenter()
        maven {
            url 'https://maven.google.com'
        }
        maven {
            // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
            url "$rootDir/../node_modules/react-native/android"
        }
    }
}
```

