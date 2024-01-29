import {Serializerable, WVEventHandler} from '@model';
import {Alert, Linking, Platform} from 'react-native';
import {AppWVBridgeEvent} from 'src/model/bridge/AppWVBridgeEvent';
import PipHandler from '../pipHandler';
import TouchID from 'react-native-touch-id';
import {reset} from '@utils';
import {exitApp} from 'react-native-exit-app';

export class MySUNI extends Serializerable implements WVEventHandler {
  openSetting() {
    Linking.openSettings();
  }

  openUrl(url: string) {
    Linking.openURL(url);
  }

  exitApp() {
    if (Platform.OS === 'android') {
      exitApp();
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
        reset('Gateway', {link, type: 'CONVENIENT'});
      })
      .catch(e => {
        if (e.code === 'NOT_ENROLLED') {
          Alert.alert('등록된 지문이 존재하지 않습니다.');
        }
      });
  }

  getInfo() {
    return {
      version: Platform.Version,
    };
  }
  async handleWVEvent(event: AppWVBridgeEvent) {
    if (event.actionType === 'exitApp') {
      this.exitApp();
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
  }
}
