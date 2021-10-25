/**
 * @format
 */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);



import {AppRegistry} from 'react-native';
import {Examples} from './Examples';
import {name} from './package.json';

export * from "./SpringScrollView";
export * from "./Types";
export * from "./RefreshHeader";
export * from "./LoadingFooter";
export * from "./NormalHeader";
export * from "./NormalFooter";

AppRegistry.registerComponent(name, () => Examples);
