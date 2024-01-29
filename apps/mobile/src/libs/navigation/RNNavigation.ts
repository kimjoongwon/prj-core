import WebView from 'react-native-webview';
import {
  RNNavigationWVBridgeEvent,
  Serializerable,
  WVEventHandler,
} from '@model';
import {back, navigate, push, reset} from '@utils';

export class RNNavigation extends Serializerable implements WVEventHandler {
  constructor(webviewRef: React.RefObject<WebView>) {
    super(webviewRef);
  }

  handleWVEvent(event: RNNavigationWVBridgeEvent) {
    const {actionType, payload} = event;

    switch (actionType) {
      case 'navigate':
        payload && navigate(payload.name, payload.params);
        break;
      case 'push':
        payload && push(payload.name, payload.params);
        break;
      case 'back':
        back();
        break;
      case 'reset':
        payload && reset(payload.name, payload.params);
        break;
    }
  }
}
