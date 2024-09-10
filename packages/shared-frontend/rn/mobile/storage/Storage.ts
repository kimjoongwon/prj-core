import { Serializerable } from '../../model/bridge/Serializerable';
import {
  MultiFactor,
  StorageKeys,
  StorageWVBridgeEvent,
  WVEventHandler,
} from '@model';
import WebView from 'react-native-webview';
import { RefObject } from 'react';
import { MMKV } from 'react-native-mmkv';
import { isJSONString } from '@utils';
import { end } from 'src/components/ui/webview/injectedJavascripts';
export const storageKeys = [
  'aosAccessAuth',
  'iosAccessAuth',
  'suniIdCode',
  'deviceLanguage',
  'access_token',
  'refresh_token',
  'username',
  'password',
  'multi_factor',
  'MANDATORY_CONFIRM',
  'already_mobile_user',
  'fcmToken',
  'iosSetting',
  'checked_mobile_permission',
  'loggedInUsername',
  'loggedInPassword',
  'version',
  'platform',
  'i18nResourceTime',
] as const;

export class Storage extends Serializerable implements WVEventHandler {
  private static instance: Storage;
  initializedStorageJavascript = '';
  private mmkv: MMKV;

  private constructor(webviewRef: RefObject<WebView>) {
    super(webviewRef);
    this.mmkv = new MMKV();
    this.init();
  }

  async init() {
    let storageKeyStrings: string[] = [];

    storageKeys.map(async key => {
      const value = key ? this.mmkv?.getString(key) : null;

      if (value) {
        storageKeyStrings.push(`localStorage.setItem('${key}', '${value}');`);
      }
    });
    this.initializedStorageJavascript = storageKeyStrings.join('');
    return this.initializedStorageJavascript;
  }

  static getInstance(webviewRef: RefObject<WebView>): Storage {
    if (!Storage.instance) {
      Storage.instance = new Storage(webviewRef);
    }
    return Storage.instance;
  }

  set(key: StorageKeys, value: unknown) {
    let jsonValue = JSON.stringify(value);
    if (typeof value === 'string') {
      jsonValue = value;
    }

    this.mmkv.set(key, jsonValue);
  }

  get(key: StorageKeys) {
    const value = this.mmkv.getString(key);

    if (!value) {
      return value;
    }

    if (isJSONString(value)) {
      return JSON.parse(value);
    }

    return value;
  }

  remove(key: StorageKeys) {
    this.mmkv.delete(key);
    const payload: StorageWVBridgeEvent = {
      type: 'Storage',
      actionType: 'remove',
      payload: {
        value: 'success',
      },
    };

    this.sendMessageFromRNToWV(payload);
  }

  clear() {
    const payload: StorageWVBridgeEvent = {
      type: 'Storage',
      actionType: 'clear',
      payload: {
        value: 'success',
      },
    };

    this.sendMessageFromRNToWV(payload);

    return this.mmkv.clearAll();
  }

  getMultiFactor(): MultiFactor | undefined {
    const multiFactor: MultiFactor | undefined = this.get('multi_factor');

    if (!multiFactor) {
      return multiFactor;
    }
    return multiFactor;
  }

  resetMultiFactor() {
    return this.mmkv.set(
      'multi_factor',
      JSON.stringify({
        enable: false,
        type: '',
        data: '',
      }),
    );
  }

  async syncLocalStorageFromRNStorage() {
    const injectedLocalStroage = await this.init();
    if (this.webviewRef && this.webviewRef.current) {
      this.webviewRef.current.injectJavaScript(injectedLocalStroage + end);
    }

    const payload: StorageWVBridgeEvent = {
      type: 'Storage',
      actionType: 'syncLocalStorageFromRNStorage',
      payload: {
        value: 'success',
      },
    };

    this.sendMessageFromRNToWV(this.serialize(payload));
  }

  async handleWVEvent(event: StorageWVBridgeEvent) {
    const payload = event.payload;
    const key = payload?.key || ('' as StorageKeys);
    const value = payload?.value;
    if (event?.payload) {
      if (event.actionType === 'set') {
        this.set(key, value);
        const payload: StorageWVBridgeEvent = {
          type: 'Storage',
          actionType: 'set',
          payload: {
            key,
            value: 'success',
          },
        };

        this.sendMessageFromRNToWV(payload);
        return;
      }

      if (event.actionType === 'get') {
        const _value = this.get(key);

        const payload: StorageWVBridgeEvent = {
          type: 'Storage',
          actionType: 'get',
          payload: {
            key,
            value: _value,
          },
        };

        this.sendMessageFromRNToWV(payload);

        return;
      }

      if (event.actionType === 'remove') {
        this.remove(key);
        return;
      }
    }

    if (event.actionType === 'clear') {
      this.clear();
      return;
    }

    if (event.actionType === 'syncLocalStorageFromRNStorage') {
      this.syncLocalStorageFromRNStorage();
      return;
    }
  }
}
