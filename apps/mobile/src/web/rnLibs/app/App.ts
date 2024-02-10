import { AppWVBridgeEvent, Serializerable } from '../../model';
import { storage } from '../../util/beforeApp';
import { isExternalLink } from '../../util/link';

export class App extends Serializerable {
  private static instance: App;
  constructor() {
    super();
  }

  static getInstance() {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }

  clearCookies() {
    const payload: AppWVBridgeEvent = {
      type: 'App',
      actionType: 'clearCookies',
    };
    this.sendMessageFromWVToRN(payload);
  }

  exitApp() {
    const payload: AppWVBridgeEvent = {
      type: 'App',
      actionType: 'exitApp',
    };
    this.sendMessageFromWVToRN(payload);
  }

  fingerprintAuthenticate(link: string) {
    const payload: AppWVBridgeEvent = {
      type: 'App',
      actionType: 'fingerprintAuthenticate',
      payload: {
        link,
      },
    };

    this.sendMessageFromWVToRN(payload);
  }

  setPipEnabled(isPipEnabled: boolean) {
    const payload: AppWVBridgeEvent = {
      type: 'App',
      actionType: 'setPipEnabled',
      payload: {
        isPipEnabled,
      },
    };
    this.sendMessageFromWVToRN(payload);
  }

  lockLandscape() {
    const payload: AppWVBridgeEvent = {
      type: 'App',
      actionType: 'landscape-left',
    };
    this.sendMessageFromWVToRN(payload);
  }

  lockLandscapeLeft() {
    const payload: AppWVBridgeEvent = {
      type: 'App',
      actionType: 'landscape-left',
    };
    this.sendMessageFromWVToRN(payload);
  }

  lockLandscapeRight() {
    const payload: AppWVBridgeEvent = {
      type: 'App',
      actionType: 'landscape-right',
    };
    this.sendMessageFromWVToRN(payload);
  }

  lockPortrait() {
    const payload: AppWVBridgeEvent = {
      type: 'App',
      actionType: 'portrait',
    };
    this.sendMessageFromWVToRN(payload);
  }

  lockPortraitUp() {
    const payload: AppWVBridgeEvent = {
      type: 'App',
      actionType: 'portrait-up',
    };
    this.sendMessageFromWVToRN(payload);
  }

  lockPortraitDown() {
    const payload: AppWVBridgeEvent = {
      type: 'App',
      actionType: 'portrait-down',
    };
    this.sendMessageFromWVToRN(payload);
  }

  unlock() {
    const payload: AppWVBridgeEvent = {
      type: 'App',
      actionType: 'all',
    };
    this.sendMessageFromWVToRN(payload);
  }

  getInfo() {
    return {
      // @STORAGE
      // version: localStorage.getItem('version'),
      version: storage.get('version'),
    };
  }

  openSettings() {
    const payload: AppWVBridgeEvent = {
      type: 'App',
      actionType: 'openSettings',
    };

    this.sendMessageFromWVToRN(payload);
  }

  /**
   * url이 외부 링크인지 확인 후
   * - 외부 링크면 외부 브라우저
   * - 내부 링크면 window.location.href
   */
  openUrl(url: string) {
    if (isExternalLink(url)) {
      const payload: AppWVBridgeEvent = {
        type: 'App',
        actionType: 'openUrl',
        payload: {
          url,
        },
      };

      this.sendMessageFromWVToRN(payload);
    } else {
      window.location.href = url;
    }
  }

  /**
   * 외부 브라우저로 url을 엽니다.
   */
  externalBrowser(url: string) {
    const payload: AppWVBridgeEvent = {
      type: 'App',
      actionType: 'openUrl',
      payload: {
        url,
      },
    };

    this.sendMessageFromWVToRN(payload);
  }
}
