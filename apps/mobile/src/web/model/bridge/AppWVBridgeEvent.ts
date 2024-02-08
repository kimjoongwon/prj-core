export interface AppWVBridgeEvent {
  type: 'App';
  actionType:
    | 'openSettings'
    | 'openUrl'
    | 'exitApp'
    | 'setPipEnabled'
    | 'landscape'
    | 'landscape-left'
    | 'landscape-right'
    | 'portrait-down'
    | 'portrait-up'
    | 'portrait'
    | 'all'
    | 'unlock'
    | 'fingerprintAuthenticate'
    | 'clearCookies';
  payload?: {
    url?: string;
    isPipEnabled?: boolean;
    link?: string;
  };
}
