import {
  GatewayScreen,
  PlayGroundScreen,
  PatternScreen,
  AuthScreen,
  AuthConfigScreen,
  PinScreen,
} from '@screens';
import {DevDashboardScreen} from 'src/screens/devDashboard/DevDashboardScreen';
import {InAppBrowserScreen} from 'src/screens/inAppBrowser/InAppBrowserScreen';

export const baseScreens = [
  {
    key: 'PlayGround',
    props: {
      name: 'PlayGround',
      component: PlayGroundScreen,
    },
  },
  {
    key: 'Gateway',
    props: {
      name: 'Gateway',
      component: GatewayScreen,
    },
  },
  {
    key: 'Pin',
    props: {
      name: 'Pin',
      component: PinScreen,
    },
  },
  {
    key: 'Pattern',
    props: {
      name: 'Pattern',
      component: PatternScreen,
    },
  },
  {
    key: 'Auth',
    props: {
      name: 'Auth',
      component: AuthScreen,
    },
  },
  {
    key: 'AuthConfig',
    props: {
      title: '로그인 설정',
      name: 'AuthConfig',
      component: AuthConfigScreen,
    },
  },
  {
    key: 'InAppBrowser',
    props: {
      name: 'InAppBrowser',
      component: InAppBrowserScreen,
    },
  },
  {
    key: 'DevDashboard',
    props: {
      name: 'DevDashboard',
      component: DevDashboardScreen,
    },
  },
] as const;
