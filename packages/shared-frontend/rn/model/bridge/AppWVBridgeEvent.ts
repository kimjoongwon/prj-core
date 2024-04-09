export interface AppWVBridgeEvent {
  type: 'App';
  actionType:
    | 'removeSessionCookies'
    | 'openSettings'
    | 'openUrl'
    | 'exitApp'
    | 'setPipEnabled'
    | 'fingerprintAuthenticate'
    | 'landscape-left'
    | 'landscape-right'
    | 'portrait'
    | 'portrait-up'
    | 'portrait-down'
    | 'all'
    | 'clearCookies'
    | 'requestPanoptoAuth'
    | 'clearCache'
    | 'setIsLoggedIn'
    | 'setDenizenId'
    | 'clearHistory';
  payload?: {
    url?: string;
    isPipEnabled?: boolean;
    link?: string;
    isSessionCookiesRemoved?: boolean;
    denizenId?: string | undefined;
    isLoggedIn?: boolean;
  };
}
