import { BaseBridgeEvent } from './BaseBridgeEvent';

export interface PlatformWVBridgeEvent extends BaseBridgeEvent {
  type: 'Platform';
  actionType: 'OS';
  payload?: {
    value: OS;
  };
}

export type OS = 'ios' | 'android' | 'windows' | 'macos' | 'web' | null;
