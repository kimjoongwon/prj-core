import { MultiFactor } from '../../../tracker/model';
import { StorageWVBridgeEvent, Serializerable } from '../../model';

export type StorageKey =
  | 'nara.companyCode'
  | 'language'
  | 'access_token'
  | 'refresh_token'
  | 'username'
  | 'password'
  | 'multi_factor'
  | 'MANDATORY_CONFIRM'
  | 'already_mobile_user'
  | 'fcmToken'
  | 'iosSetting'
  | 'checked_mobile_permission'
  | 'loggedInUsername'
  | 'loggedInPassword'
  | 'isConvenient'
  | 'communityRecentSearchWords'
  | 'language'
  | 'recent_search'
  | 'version'
  | 'platform'
  | 'i18nResources_Korean'
  | 'i18nResources_English'
  | 'i18nResources_Chinese'
  | 'i18nResourceTime'
  | 'email'
  | 'nara.jti'
  | '_mysuni_auth'
  | '_mysuni_pv_init'
  | '_mysuni_field'
  | 'prev_pv'
  | 'fcmUrl'
  | 'nara.token'
  | 'nara.email'
  | 'nara.refreshToken'
  | 'nara.workspaces'
  | 'nara.cineroomId'
  | 'nara.audienceId'
  | 'nara.pavilionId'
  | 'dashBoardSentenceIndex'
  | 'event_banner'
  | 'nara.displayName';

/**
 * @description 해당 스토리지는 localstorage를 Wrapping해서 이용하는 것이고 JSON.parse와 JSON.stringify를 내부에서 해줍니다.
 * 그리고 set에서 3번째 persist변수로 true를 주게되면 ReactNative 영구 저장소에 저장됩니다.
 */
export class Storage extends Serializerable {
  private static instance: Storage;

  private constructor() {
    super();
  }

  static getInstance(): Storage {
    if (!Storage.instance) {
      Storage.instance = new Storage();
    }
    return Storage.instance;
  }

  async set(key: StorageKey, value: unknown) {
    let jsonValue = JSON.stringify(value);

    if (typeof value === 'string') {
      jsonValue = value;
    }

    const payload: StorageWVBridgeEvent = {
      type: 'Storage',
      actionType: 'set',
      payload: {
        key,
        value: jsonValue,
      },
    };
    localStorage.setItem(key, jsonValue);

    this.sendMessageFromWVToRN(payload);
  }

  get(key: StorageKey) {
    const item = localStorage.getItem(key) || '';
    if (!isJSONString(item)) {
      return item;
    }

    return JSON.parse(item);
  }

  async remove(key: StorageKey) {
    const payload: StorageWVBridgeEvent = {
      type: 'Storage',
      actionType: 'remove',
      payload: {
        key,
      },
    };
    localStorage.removeItem(key);
    this.sendMessageFromWVToRN(payload);
  }

  clearRNStorage() {
    const payload = {
      type: 'Storage',
      actionType: 'clear',
    } as StorageWVBridgeEvent;

    this.sendMessageFromWVToRN(payload);
  }

  async syncLocalStorageFromRNStorage() {
    const payload: StorageWVBridgeEvent = {
      type: 'Storage',
      actionType: 'syncLocalStorageFromRNStorage',
      payload: {
        key: undefined,
        value: undefined,
      },
    };

    this.sendMessageFromWVToRN(payload);

    const result = (await this.waitForMessage()) as StorageWVBridgeEvent;

    return result;
  }

  getMultiFactor() {
    return parseMultiFactor(this.get('multi_factor'));
  }
}

function parseMultiFactor(value: string | undefined): MultiFactor | undefined {
  if (value === undefined) {
    return undefined;
  }
  const multiFactor: MultiFactor = JSON.parse(value);
  return multiFactor;
}

function isJSONString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
