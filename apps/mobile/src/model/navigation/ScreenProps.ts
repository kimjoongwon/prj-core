import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type LinkParam = {link?: string};

type MultiFactorSettingType = 'CREATE' | 'CHANGE' | 'AUTH';

export type RootStackParamList = {
  Splash: LinkParam;
  Bio: LinkParam;
  Pattern: {
    type: MultiFactorSettingType;
    guideMessagePrefix: string;
  } & LinkParam;
  Pin: LinkParam & {type: MultiFactorSettingType};
  Gateway: LinkParam & {type: 'DEFAULT' | 'CONVENIENT' | 'LOGIN'};
  PlayGround: undefined;
  AuthConfig: LinkParam;
  Auth: LinkParam;
  InAppBrowser: {url: string};
  DevDashboard: undefined;
};
/**
 * PinSettingType
 * CREATE: 핀 생성
 * CHANGE: 핀 변경
 * AUTH: 핀 인증
 */
export type SplashScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Splash'
>;

export type BioScreenProps = NativeStackScreenProps<RootStackParamList, 'Bio'>;

export type PatternScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Pattern'
>;

export type PinScreenProps = NativeStackScreenProps<RootStackParamList, 'Pin'>;

export type GatewayScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Gateway'
>;

export type AuthConfigScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AuthConfig'
>;

export type AuthScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Auth'
>;

export type InAppBrowserProps = NativeStackScreenProps<
  RootStackParamList,
  'InAppBrowser'
>;

export type DevDashboardScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'DevDashboard'
>;
