import { MultiFactor } from '../../../tracker/model';
import { StorageWVBridgeEvent, Serializerable } from '../../model';
import { storage } from '../../util/beforeApp';

export type StorageKey =
  | 'savedId'
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
  // 대외 사용하지 않음.
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
    // rnStorage저장
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

  async clear() {
    const payload = {
      type: 'Storage',
      actionType: 'clear',
    } as StorageWVBridgeEvent;

    // localStorage.clear();
    storage.set('access_token', '');
    storage.set('refresh_token', '');
    this.sendMessageFromWVToRN(payload);
  }

  getMultiFactor() {
    return parseMultiFactor(this.get('multi_factor'));
  }
}

// function StorageReturn(value: string | undefined): string | undefined {
//   if (value === null || value === '') {
//     return undefined;
//   }
//   return value;
// }

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
