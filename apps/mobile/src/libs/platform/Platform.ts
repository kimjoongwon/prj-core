import {RefObject} from 'react';
import {Platform as BasePlatForm} from 'react-native';
import WebView from 'react-native-webview';
import {PlatformWVBridgeEvent, Serializerable, WVEventHandler} from '@model';
import Permission from 'react-native-permissions';
export class Platform extends Serializerable implements WVEventHandler {
  constructor(webviewRef: RefObject<WebView>) {
    super(webviewRef);
  }

  OS() {
    return BasePlatForm.OS;
  }

  permission() {
    Permission.check('android.permission.READ_EXTERNAL_STORAGE');
  }

  handleWVEvent(): void {
    const payload: PlatformWVBridgeEvent = {
      type: 'Platform',
      actionType: 'OS',
      payload: {
        value: this.OS(),
      },
    };
    this.sendMessageFromRNToWV(payload);
  }
}
