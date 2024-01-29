import {Platform} from 'react-native';

export interface PlatformWVBridgeEvent {
  type: 'Platform';
  actionType: 'OS';
  payload: {
    value: (typeof Platform)['OS'];
  };
}
