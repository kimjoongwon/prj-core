import React, {createContext, useState} from 'react';
import {View} from '@components';
import {StyleSheet} from 'react-native';
import {WebViewNavigation} from 'react-native-webview';

interface WebviewProviderProps {
  children: React.ReactNode;
}

interface WebViewContextValue {
  currentUrl?: string;
  setCurrentUrl: (url?: string) => void;
  webViewNavigation?: WebViewNavigation;
  setCurrentWebViewNavigation: (webViewNavigation: WebViewNavigation) => void;
}

const WebViewContext = createContext({} as WebViewContextValue);

export const WebViewProvider = (props: WebviewProviderProps) => {
  const [url, setUrl] = useState<string>();
  const [webViewNavigation, setWebViewNavigation] = useState<
    WebViewNavigation | undefined
  >();

  const {children} = props;

  const setCurrentUrl = (currentUrl?: string) => {
    setUrl(currentUrl);
  };

  const setCurrentWebViewNavigation = (
    currentWebViewNavigation: WebViewNavigation,
  ) => {
    setWebViewNavigation(currentWebViewNavigation);
  };

  return (
    <WebViewContext.Provider
      value={{
        setCurrentWebViewNavigation,
        webViewNavigation,
        setCurrentUrl,
        currentUrl: url,
      }}>
      <View style={styles.container}>{children}</View>
    </WebViewContext.Provider>
  );
};

export const useWebView = () => {
  return React.useContext(WebViewContext);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});
