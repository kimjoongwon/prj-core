import { Serializerable, SplashScreenWVBridgeEvent } from '../../model';

export class SplashScreen extends Serializerable {
  private static instance: SplashScreen;

  constructor() {
    super();
  }
  static getInstance(): SplashScreen {
    if (!SplashScreen.instance) {
      SplashScreen.instance = new SplashScreen();
    }
    return SplashScreen.instance;
  }
  hide() {
    const payload: SplashScreenWVBridgeEvent = {
      type: 'SplashScreen',
      actionType: 'hide',
    };

    this.sendMessageFromWVToRN(payload);
  }
}
