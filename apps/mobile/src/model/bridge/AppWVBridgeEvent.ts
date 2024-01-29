export interface AppWVBridgeEvent {
  type: 'App';
  actionType:
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
    | 'all';
  payload?: {
    url: string;
    isPipEnabled: boolean;
    link?: string;
  };
}
