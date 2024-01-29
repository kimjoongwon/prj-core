import {RefObject} from 'react';
import WebView from 'react-native-webview';
import {PermissionWVBridgeEvent, Serializerable, WVEventHandler} from '@model';
import {PERMISSIONS, request} from 'react-native-permissions';
import {Platform} from 'react-native';

export class Permission extends Serializerable implements WVEventHandler {
  constructor(webviewRef: RefObject<WebView>) {
    super(webviewRef);
  }
  async camera() {
    try {
      const os = Platform.OS;
      const cameraPermission =
        os === 'android' ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA;

      // Request Permission
      const result = await request(cameraPermission);

      if (result === 'granted') {
        console.debug('권한이 허용되었습니다.');
        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async handleWVEvent() {
    const payload: PermissionWVBridgeEvent = {
      type: 'Permission',
      actionType: 'camera',
      payload: {
        value: await this.camera(),
      },
    };

    this.sendMessageFromRNToWV(payload);
  }
}
