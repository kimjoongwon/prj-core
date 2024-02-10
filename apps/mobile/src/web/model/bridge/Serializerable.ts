import { platform } from '../../util/beforeApp';
import { BridgeEvent } from './BridgeEvent';

export class Serializerable {
  serialize(value: any) {
    const isJSONStringfiable = this.isJSONStringfiable(value);

    if (isJSONStringfiable) {
      return JSON.stringify(value);
    }

    return value;
  }

  sendMessageFromWVToRN(message: BridgeEvent) {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView?.postMessage(this.serialize(message));
    }
  }

  waitForMessage(): Promise<BridgeEvent> {
    return new Promise(resolve => {
      if (platform.getOS() === 'android') {
        document.addEventListener('message', function listener(event) {
          document.removeEventListener('message', listener);
          resolve(JSON.parse((event as any).data));
        });

        return;
      }

      if (platform.getOS() === 'ios') {
        window.addEventListener('message', function listener(event) {
          window.removeEventListener('message', listener);
          resolve(JSON.parse(event.data));
        });

        return;
      }
      return resolve({} as BridgeEvent);
    });
  }

  isJSONStringfiable(value: any) {
    try {
      JSON.stringify(value);
      return true;
    } catch (e) {
      return false;
    }
  }
}
