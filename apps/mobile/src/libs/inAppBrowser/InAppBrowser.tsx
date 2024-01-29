import {
  BridgeEvent,
  InAppBrowserWVBridgeEvent,
  Serializerable,
  WVEventHandler,
} from '@model';
import {RefObject} from 'react';
import WebView from 'react-native-webview';
import BaseInAppBrowser from 'react-native-inappbrowser-reborn';

export class InAppBrowser extends Serializerable implements WVEventHandler {
  private static instance: InAppBrowser;
  constructor(webviewRef: RefObject<WebView>) {
    super(webviewRef);
  }

  static getInstance(webviewRef: RefObject<WebView>): InAppBrowser {
    if (!InAppBrowser.instance) {
      InAppBrowser.instance = new InAppBrowser(webviewRef);
    }
    return InAppBrowser.instance;
  }

  open(url: string) {
    return BaseInAppBrowser.open(url);
  }

  async handleWVEvent(event: BridgeEvent) {
    const payload: InAppBrowserWVBridgeEvent = {
      type: 'InAppBrowser',
      actionType: 'open',
    };

    if (event.actionType === 'open') {
      await this.open(event.payload?.url || '');
      await this.sendMessageFromRNToWV(this.serialize(payload));
    }
  }
}
