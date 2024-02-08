declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage(msg: string): void;
    };
    platform: string;
  }
}

export const ReactNativeWebView = window.ReactNativeWebView;
