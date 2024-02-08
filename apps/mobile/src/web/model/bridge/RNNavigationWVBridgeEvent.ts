export type LinkParam = { link?: string };

type MultiFactorSettingType = 'CREATE' | 'CHANGE' | 'AUTH';

export type RootStackParamList = {
  Splash: LinkParam;
  Bio: LinkParam;
  Pattern: {
    type: MultiFactorSettingType;
    guideMessagePrefix: string;
  } & LinkParam;
  Pin: LinkParam & { type: MultiFactorSettingType };
  Gateway: LinkParam & { type?: 'CONVENIENT' | 'DEFAULT' | 'LOGIN' };
  PlayGround: undefined;
  AuthConfig: LinkParam;
  Auth: LinkParam;
  InAppBrowser: { url: string };
};

export type ScreenName = keyof RootStackParamList;
export type Params = RootStackParamList[keyof RootStackParamList];

export interface RNNavigationWVBridgeEvent {
  type: 'RNNavigation';
  actionType: 'navigate' | 'go' | 'back' | 'reset' | 'push';
  payload?: {
    name: ScreenName;
    params?: Params;
  };
}

// export type ScreenName = 'Gateway' | 'Auth';
