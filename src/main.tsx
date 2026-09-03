/**
 * Web entry point. Replaces Expo's `registerRootComponent`.
 *
 * AppRegistry.runApplication is react-native-web's own bootstrap: it mounts the
 * root and installs the stylesheet RNW generates, which plain ReactDOM.render
 * would skip.
 */
import { AppRegistry } from 'react-native';
import App from '../App';

AppRegistry.registerComponent('Detour', () => App);

const rootTag = document.getElementById('root');
if (!rootTag) throw new Error('Root element #root not found in index.html');

AppRegistry.runApplication('Detour', { rootTag });
