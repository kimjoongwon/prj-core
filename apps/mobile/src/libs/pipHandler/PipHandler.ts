import {NativeEventEmitter, NativeModules, Platform} from 'react-native';

class PipHandler {
  EventEmitter: NativeEventEmitter | null;

  constructor() {
    this.EventEmitter =
      Platform.OS === 'android' ? new NativeEventEmitter() : null;
  }

  setPipEnabled(enabled: boolean) {
    return NativeModules?.PipAndroid?.setPipEnabled(enabled);
  }

  onPipModeChanged(listener: (isModeEnabled: Boolean) => void) {
    return this?.EventEmitter?.addListener('PIP_MODE_CHANGE', listener);
  }

  onPipActionChanged(listener: (action: string) => void) {
    return this?.EventEmitter?.addListener('PIP_ACTION_CHANGE', listener);
  }

  getPipEnabled() {
    return NativeModules?.PipAndroid?.getPipEnabled();
  }

  enterPipMode(width?: number, height?: number) {
    return NativeModules?.PipAndroid?.enterPipMode(
      width ? Math.floor(width) : 0,
      height ? Math.floor(height) : 0,
    );
  }
}

export default new PipHandler();
