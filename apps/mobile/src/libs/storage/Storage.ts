import BaseAsyncStorage from '@react-native-async-storage/async-storage';
import {Serializerable} from '../../model/bridge/Serializerable';
import {
  MultiFactor,
  StorageKey,
  StorageWVBridgeEvent,
  WVEventHandler,
} from '@model';
import WebView from 'react-native-webview';
import {RefObject} from 'react';
export const storageKeys = [
  'language',
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
  'communityRecentSearchWords',
  'language',
  'recent_search',
  'version',
  'platform',
  // 'i18nResources_Korean', ---> 대외 사용하지 않음.
  // 'i18nResources_English',
  // 'i18nResources_Chinese',
  'i18nResourceTime',
  'email',
  'nara.jti',
  '_mysuni_auth',
  '_mysuni_pv_init',
  '_mysuni_field',
  'prev_pv',
  'fcmUrl',
  'nara.token',
  'nara.email',
  'nara.refreshToken',
  'nara.workspaces',
  'nara.cineroomId',
  'nara.audienceId',
  'nara.pavilionId',
  'dashBoardSentenceIndex',
  'nara.displayName',
] as const;

export class Storage extends Serializerable implements WVEventHandler {
  private static instance: Storage;
  initializedStorageJavascript = '';

  private constructor(webviewRef: RefObject<WebView>) {
    super(webviewRef);
    this.init();
  }

  async init() {
    let storageKeyStrings: string[] = [];

    await Promise.all(
      storageKeys.map(async key => {
        const value = await BaseAsyncStorage.getItem(key);
        if (value) {
          storageKeyStrings.push(
            `window.localStorage.setItem('${key}', '${value}');`,
          );
        }
      }),
    );
    this.initializedStorageJavascript = storageKeyStrings.join('');
    return this.initializedStorageJavascript;
  }

  static getInstance(webviewRef: RefObject<WebView>): Storage {
    if (!Storage.instance) {
      Storage.instance = new Storage(webviewRef);
    }
    return Storage.instance;
  }

  set(key: StorageKey, value: unknown) {
    let jsonValue = JSON.stringify(value);
    if (typeof value === 'string') {
      jsonValue = value;
    }
    const injectedJavaScript = `window.localStorage.setItem('${key}', '${jsonValue}'); true;`;
    this.webviewRef.current?.injectJavaScript(injectedJavaScript);

    return BaseAsyncStorage.setItem(key, jsonValue);
  }

  async get(key: StorageKey) {
    const value = await BaseAsyncStorage.getItem(key);
    if (value === null) {
      return value;
    }
    return value;
  }

  async getMultiFactor(): Promise<MultiFactor | undefined> {
    const multiFactor = await BaseAsyncStorage.getItem('multi_factor');

    if (multiFactor === null) {
      return undefined;
    }
    return JSON.parse(multiFactor);
  }

  remove(key: StorageKey) {
    const injectedJavaScript = `window.localStorage.removeItem('${key}');true;`;
    this.webviewRef.current?.injectJavaScript(injectedJavaScript);
    return BaseAsyncStorage.removeItem(key);
  }

  clear() {
    return BaseAsyncStorage.clear();
  }

  resetMultiFactor() {
    return BaseAsyncStorage.setItem(
      'multi_factor',
      JSON.stringify({
        enable: false,
        type: '',
        data: '',
      }),
    );
  }

  async handleWVEvent(event: StorageWVBridgeEvent) {
    const payload = event.payload;
    const key = payload?.key || ('' as StorageKey);
    const value = payload?.value;

    if (event.payload) {
      if (event.actionType === 'set') {
        return this.set(key, value);
      }

      if (event.actionType === 'get') {
        const serializedValue: StorageWVBridgeEvent = {
          type: 'Storage',
          actionType: 'get',
          payload: {
            key: event.payload.key,
            value: (await this.get(key)) || '',
          },
        };

        return this.sendMessageFromRNToWV(serializedValue);
      }

      if (event.actionType === 'remove') {
        return this.remove(event.payload.key);
      }
    }

    if (event.actionType === 'clear') {
      return this.clear();
    }
  }
}
