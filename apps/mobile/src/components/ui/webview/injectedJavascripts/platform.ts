import {Platform} from 'react-native';

export const injectedJavascriptPlatform = `window.localStorage.setItem('platform', '${Platform.OS}');`;
