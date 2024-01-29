import {FileBrowserWVBridgeEvent, Serializerable, WVEventHandler} from '@model';
import {RefObject} from 'react';
import WebView from 'react-native-webview';
import documentPicker, {
  DocumentPickerOptions,
} from 'react-native-document-picker';

export class FileBrowser extends Serializerable implements WVEventHandler {
  constructor(webviewRef: RefObject<WebView>) {
    super(webviewRef);
  }

  pick(opts?: DocumentPickerOptions<'ios' | 'android'>) {
    return documentPicker.pick(opts);
  }

  pickSingle(opts?: DocumentPickerOptions<'ios' | 'android'>) {
    return documentPicker.pickSingle({
      ...opts,
      copyTo: 'cachesDirectory',
    });
  }

  async handleWVEvent(event: FileBrowserWVBridgeEvent) {
    const isPick = event.actionType === 'pick';
    const payload: FileBrowserWVBridgeEvent = {
      actionType: event.actionType,
      type: 'FileBrowser',
      payload: {
        value: isPick ? await this.pick() : await this.pickSingle(),
      },
    };

    return this.sendMessageFromRNToWV(payload);
  }
}
