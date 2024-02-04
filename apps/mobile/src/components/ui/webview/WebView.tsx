import React, {useEffect} from 'react';
import {BridgeEvent, OrientationWVBridgeEvent} from '@model';
import SplashScreen from 'react-native-splash-screen';
import BaseWebView, {
  WebViewMessageEvent,
  WebViewProps,
} from 'react-native-webview';
import {
  fileBrowser,
  fileSystem,
  inappbrowser,
  media,
  mySUNI,
  navigation as mySUNINavigation,
  permission,
  platform,
  storage,
  webviewRef,
} from 'src/App';
import Config from 'react-native-config';
import {useWebView} from 'src/providers';
import {
  end,
  injectedJavascriptPlatform,
  injectedJavascriptVersion,
} from './injectedJavascripts';
import {useStorageJavascript} from '@hooks';
import Orientation from 'react-native-orientation-locker';

interface BaseWebViewProps extends WebViewProps {
  handleOrientationEvent?: (event: OrientationWVBridgeEvent) => void;
}

export const WebView = (props: BaseWebViewProps) => {
  const {setCurrentUrl, setCurrentWebViewNavigation} = useWebView();
  const {handleOrientationEvent} = props;
  useStorageJavascript();

  const handleMessage = async (event: WebViewMessageEvent) => {
    const data = (await JSON.parse(event.nativeEvent.data)) as BridgeEvent;
    if (data.type === 'RNConsole') {
      const tag = data.payload?.tag || '';
      const variable = data.payload.message || '';
      console.log(tag, variable);
    }

    if (data.type === 'Orientation') {
      handleOrientationEvent && handleOrientationEvent(data);
    }

    if (data.type === 'InAppBrowser') {
      inappbrowser.handleWVEvent(data);
    }

    if (data.type === 'FileBrowser') {
      fileBrowser.handleWVEvent(data);
    }

    if (data.type === 'FileSystem') {
      fileSystem.handleWVEvent(data);
    }

    if (data.type === 'Storage') {
      storage.handleWVEvent(data);
    }

    if (data.type === 'SplashScreen') {
      SplashScreen.hide();
    }

    if (data.type === 'Platform') {
      platform.handleWVEvent();
    }

    if (data.type === 'Media') {
      media.handleWVEvent(data);
    }

    if (data.type === 'Permission') {
      permission.handleWVEvent();
    }

    if (data.type === 'App') {
      console.log('actionType', data.actionType);
      if (data.actionType === 'landscape-left') {
        Orientation.lockToLandscapeLeft();
        return;
      }

      if (data.actionType === 'landscape-right') {
        Orientation.lockToLandscapeRight();
        return;
      }

      if (data.actionType === 'portrait') {
        Orientation.lockToPortrait();
        return;
      }

      if (data.actionType === 'all') {
        Orientation.unlockAllOrientations();
        return;
      }

      mySUNI.handleWVEvent(data);
    }

    if (data.type === 'RNNavigation') {
      mySUNINavigation.handleWVEvent(data);
    }
  };

  useEffect(() => {
    if (Config.BUILD_TYPE === 'debug') {
      console.log('Config', Config);
    }
  }, []);

  return (
    <BaseWebView
      ref={webviewRef}
      onNavigationStateChange={event => {
        setCurrentWebViewNavigation(event);
        setCurrentUrl(event.url);
        props.onNavigationStateChange && props.onNavigationStateChange(event);
      }}
      injectedJavaScript={
        storage.initializedStorageJavascript +
        injectedJavascriptPlatform +
        injectedJavascriptVersion +
        end
      }
      useSharedProcessPool
      setBuiltInZoomControls={false}
      allowsInlineMediaPlayback={true}
      mediaPlaybackRequiresUserAction={false}
      applicationNameForUserAgent={Config.USER_AGENT}
      webviewDebuggingEnabled
      allowsBackForwardNavigationGestures
      javaScriptEnabled
      sharedCookiesEnabled
      thirdPartyCookiesEnabled
      mixedContentMode="always"
      allowFileAccess
      setSupportMultipleWindows={true}
      javaScriptCanOpenWindowsAutomatically
      allowsFullscreenVideo={true}
      allowsProtectedMedia
      cacheEnabled
      cacheMode="LOAD_DEFAULT"
      domStorageEnabled
      onError={e => console.log('error!!!!!', e)}
      allowFileAccessFromFileURLs
      allowUniversalAccessFromFileURLs
      {...props}
      onMessage={handleMessage}
      injectedJavaScriptBeforeContentLoaded={
        Config.BUILD_TYPE === 'debug'
          ? `
      window.onerror = function(message, sourcefile, lineno, colno, error) {
        alert("Message: " + message + " - Source: " + sourcefile + " Line: " + lineno + ":" + colno);
        return true;
      };true;`
          : undefined
      }
    />
  );
};
