import {ScreenName} from '../navigation';

export interface RNNavigationWVBridgeEvent {
  type: 'RNNavigation';
  actionType: 'navigate' | 'go' | 'back' | 'reset' | 'push';
  payload?: {
    name: ScreenName;
    params?: object;
  };
}
