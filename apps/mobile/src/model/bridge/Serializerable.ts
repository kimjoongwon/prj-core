import {RefObject} from 'react';
import WebView from 'react-native-webview';
import {BridgeEvent} from '.';

export class Serializerable {
  constructor(readonly webviewRef: RefObject<WebView>) {}
  serialize(value: any) {
    if (value === undefined || value === null) {
      throw new Error('undefined, null is not allowed');
    }

    if (
      typeof value === 'bigint' ||
      typeof value === 'object' ||
      typeof value === 'boolean' ||
      typeof value === 'number'
    ) {
      return JSON.stringify(value);
    }

    return value;
  }

  sendMessageFromRNToWV(event: BridgeEvent) {
    if (this.webviewRef?.current) {
      const payload = this.serialize(event);
      this.webviewRef.current?.postMessage(payload);
    }
  }
}
