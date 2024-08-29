import { Serializerable, WVEventHandler } from '@model';
import { Alert, Linking, Platform } from 'react-native';
import { AppWVBridgeEvent } from 'src/model/bridge/AppWVBridgeEvent';
import PipHandler from '../pipHandler';
import TouchID from 'react-native-touch-id';
import RNExitApp from 'react-native-exit-app';
import CookieManager from '@react-native-cookies/cookies';
import { reset } from '@utils';
import { storage } from 'src/App';
import Orientation from 'react-native-orientation-locker';

export class MySUNI extends Serializerable implements WVEventHandler {
  openSetting() {
    Linking.openSettings();
  }

  clearCookies() {
    CookieManager.clearAll(true);
    CookieManager.removeSessionCookies();
    CookieManager.flush();
  }

  async removeSessionCookies() {
    if (Platform.OS === 'android') {
      await CookieManager.removeSessionCookies();
      await CookieManager.flush();
    }

    const payload: AppWVBridgeEvent = {
      type: 'App',
      actionType: 'removeSessionCookies',
      payload: {
        isSessionCookiesRemoved: true,
      },
    };

    this.sendMessageFromRNToWV(payload);
  }

  openUrl(url: string) {
    Linking.openURL(url);
  }

  exitApp() {
    if (Platform.OS === 'android') {
      RNExitApp.exitApp();
    }
  }

  async fingerprintAuthenticate(link: string) {
    TouchID.authenticate('계속하기 위해 지문을 인식해주세요.', {
      title: '지문 인증',
      sensorDescription: '센서를 터치해주세요.',
      sensorErrorDescription: '지문인식에 실패하였습니다.',
      fallbackLabel: '지문인증에 실패하였습니다.',
      passcodeFallback: false,
      cancelText: '취소',
    })
      .then(() => {
        reset('Gateway', { link, type: 'CONVENIENT' });
      })
      .catch((e: any) => {
        if (e.code === 'NOT_ENROLLED' || e.code === 'NOT_AVAILABLE') {
          Alert.alert('등록된 지문이 존재하지 않습니다.');
        }

        if (e.code === 'FINGERPRINT_ERROR_LOCKOUT') {
          Alert.alert('너무 많은 시도를 하셨습니다. 나중에 다시 시도해주세요.');
          storage.resetMultiFactor();
        }

        if (e.code === 'FINGERPRINT_ERROR_LOCKOUT_PERMANENT') {
          Alert.alert(
            '너무 많은 시도를 하셨습니다. 지문인식이 비활성화되었습니다.',
          );
          storage.resetMultiFactor();
        }
        if (e.code === undefined) {
          storage.resetMultiFactor();
          storage.set('access_token', '');
          storage.set('refresh_token', '');
          reset('Gateway', { link, type: 'DEFAULT' });
          return;
        }
        storage.resetMultiFactor();
        storage.set('access_token', '');
        storage.set('refresh_token', '');
        reset('Gateway', { link, type: 'DEFAULT' });
      });
  }

  clearCache() {
    if (this.webviewRef && this.webviewRef.current) {
      console.log('mySUNI ClearCache', this.webviewRef.current);
      // @ts-ignore
      this.webviewRef.current.clearCache(
        Platform.OS === 'android' ? true : false,
      );
    }
  }

  clearAuth() {
    CookieManager.clearAll(true);
    storage.set('access_token', '');
    storage.set('refresh_token', '');
    storage.resetMultiFactor();
  }

  getInfo() {
    return {
      version: Platform.Version,
    };
  }
  async handleWVEvent(event: AppWVBridgeEvent) {
    if (event.actionType === 'clearCache') {
      // @ts-ignore
      this.clearCache(Platform.OS === 'android' ? true : false);
    }

    if (event.actionType === 'clearHistory') {
      if (
        this.webviewRef &&
        this.webviewRef.current &&
        Platform.OS === 'android'
      ) {
        // @ts-ignore
        this.webviewRef?.current?.clearHistory();
      }
    }

    if (event.actionType === 'landscape-left') {
      Orientation.lockToLandscapeLeft();
      return;
    }

    if (event.actionType === 'landscape-right') {
      Orientation.lockToLandscapeRight();
      return;
    }

    if (event.actionType === 'portrait') {
      Orientation.lockToPortrait();
      return;
    }

    if (event.actionType === 'all') {
      Orientation.unlockAllOrientations();
      return;
    }

    if (event.actionType === 'exitApp') {
      this.exitApp();
    }

    if (event.actionType === 'clearCookies') {
      this.clearCookies();
    }

    if (event.actionType === 'openSettings') {
      await Linking.openSettings();
    }

    if (event.actionType === 'openUrl') {
      await Linking.openURL(event.payload?.url || '');
    }

    if (event.actionType === 'setPipEnabled') {
      PipHandler.setPipEnabled(event.payload?.isPipEnabled || false);
    }

    if (event.actionType === 'fingerprintAuthenticate') {
      return this.fingerprintAuthenticate(event.payload?.link || '');
    }

    if (event.actionType === 'removeSessionCookies') {
      this.removeSessionCookies();
    }
  }
}
