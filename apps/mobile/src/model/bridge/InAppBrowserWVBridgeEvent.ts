export interface InAppBrowserWVBridgeEvent {
  type: 'InAppBrowser';
  actionType: 'open';
  payload?: {
    url: string;
  };
}
