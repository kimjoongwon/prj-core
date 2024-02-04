import {Platform} from 'react-native';

export const injectedJavascriptVersion = `window.localStorage.setItem('version', '${Platform.Version}');`;
