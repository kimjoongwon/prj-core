import {
  Params,
  RNNavigationWVBridgeEvent,
  ScreenName,
  Serializerable,
} from '../../model';
export type LinkParam = { link?: string };

export class RNNavigation extends Serializerable {
  private static instance: RNNavigation;
  constructor() {
    super();
  }

  static getInstance() {
    if (!RNNavigation.instance) {
      RNNavigation.instance = new RNNavigation();
    }
    return RNNavigation.instance;
  }

  push(screenName: ScreenName, params?: Params) {
    const payload: RNNavigationWVBridgeEvent = {
      type: 'RNNavigation',
      actionType: 'push',
      payload: {
        name: screenName,
        params: params,
      },
    };

    this.sendMessageFromWVToRN(payload);
  }

  navigate(screenName: ScreenName, params?: Params) {
    const payload: RNNavigationWVBridgeEvent = {
      type: 'RNNavigation',
      actionType: 'navigate',
      payload: {
        name: screenName,
        params: params,
      },
    };

    this.sendMessageFromWVToRN(payload);
  }

  back() {
    const payload: RNNavigationWVBridgeEvent = {
      type: 'RNNavigation',
      actionType: 'back',
    };

    this.sendMessageFromWVToRN(payload);
  }

  reset(screenName: ScreenName, params?: Params) {
    const payload: RNNavigationWVBridgeEvent = {
      type: 'RNNavigation',
      actionType: 'reset',
      payload: {
        name: screenName,
        params: params,
      },
    };

    this.sendMessageFromWVToRN(payload);
  }
}
