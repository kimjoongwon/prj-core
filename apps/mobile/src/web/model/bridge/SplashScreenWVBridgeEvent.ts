import { BaseBridgeEvent } from './BaseBridgeEvent';

export interface SplashScreenWVBridgeEvent extends BaseBridgeEvent {
  type: 'SplashScreen';
  actionType: 'hide';
}
