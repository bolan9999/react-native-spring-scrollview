
# react-native-spring-scrollview

## Getting started

`$ npm install react-native-spring-scrollview --save`

### Mostly automatic installation

`$ react-native link react-native-spring-scrollview`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-spring-scrollview` and add `RNSpringScrollview.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNSpringScrollview.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNSpringScrollviewPackage;` to the imports at the top of the file
  - Add `new RNSpringScrollviewPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-spring-scrollview'
  	project(':react-native-spring-scrollview').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-spring-scrollview/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-spring-scrollview')
  	```

#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNSpringScrollview.sln` in `node_modules/react-native-spring-scrollview/windows/RNSpringScrollview.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using Spring.Scrollview.RNSpringScrollview;` to the usings at the top of the file
  - Add `new RNSpringScrollviewPackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage
```javascript
import RNSpringScrollview from 'react-native-spring-scrollview';

// TODO: What to do with the module?
RNSpringScrollview;
```
  