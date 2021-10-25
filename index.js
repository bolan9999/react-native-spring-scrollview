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

export * from "./src/SpringScrollView";
export * from "./src/Types";
export * from "./src/RefreshHeader";
export * from "./src/LoadingFooter";
export * from "./src/NormalHeader";
export * from "./src/NormalFooter";

AppRegistry.registerComponent(name, () => Examples);
