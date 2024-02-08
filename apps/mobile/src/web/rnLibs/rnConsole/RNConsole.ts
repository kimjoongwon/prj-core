import { RNConsoleWVBridgeEvent, Serializerable } from '../../model';

export class RNConsole extends Serializerable {
  private static instance: RNConsole;

  static getInstance(): RNConsole {
    if (!RNConsole.instance) {
      RNConsole.instance = new RNConsole();
    }
    return RNConsole.instance;
  }

  log(tag?: string, message?: string) {
    const payload: RNConsoleWVBridgeEvent = {
      type: 'RNConsole',
      actionType: 'log',
      payload: {
        tag,
        message,
      },
    };
    this.sendMessageFromWVToRN(payload);
  }
}
