/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import WebView from 'react-native-webview';
import {NavigationContainer} from '@react-navigation/native';

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <WebView
        source={{uri: 'https://stg.connect.mysuni.com/suni-mobile/auth/login'}}
      />
    </NavigationContainer>
  );
}

export default App;
