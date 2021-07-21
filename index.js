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

AppRegistry.registerComponent(name, () => Examples);