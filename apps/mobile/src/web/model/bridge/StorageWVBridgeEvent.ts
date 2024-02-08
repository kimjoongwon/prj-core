import { StorageKey } from '../../rnLibs/storage/Storage';
import { BaseBridgeEvent } from './BaseBridgeEvent';

export interface StorageWVBridgeEvent extends BaseBridgeEvent {
  type: 'Storage';
  actionType: 'get' | 'set' | 'remove' | 'clear';
  payload: {
    key: StorageKey;
    value?: string;
  };
}
