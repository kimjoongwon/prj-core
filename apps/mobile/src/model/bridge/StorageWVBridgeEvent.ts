import {StorageKey} from '../storage/StorageKey';

export interface StorageWVBridgeEvent {
  type: 'Storage';
  actionType: 'get' | 'set' | 'remove' | 'clear';
  payload?: {
    key: StorageKey;
    value: string;
  };
}
