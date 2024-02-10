import { FileBrowserWVBridgeEvent, Serializerable } from '../../model';

export class FileBrowser extends Serializerable {
  private static instance: FileBrowser;
  constructor() {
    super();
  }

  static getInstance() {
    if (!FileBrowser.instance) {
      FileBrowser.instance = new FileBrowser();
    }
    return FileBrowser.instance;
  }

  async pick() {
    const payload: FileBrowserWVBridgeEvent = {
      type: 'FileBrowser',
      actionType: 'pick',
    };

    this.sendMessageFromWVToRN(payload);
    const event = (await this.waitForMessage()) as FileBrowserWVBridgeEvent;

    return event;
  }

  async pickSingle() {
    const payload: FileBrowserWVBridgeEvent = {
      type: 'FileBrowser',
      actionType: 'pickSingle',
    };

    this.sendMessageFromWVToRN(payload);
    const event = (await this.waitForMessage()) as FileBrowserWVBridgeEvent;
    // alert(JSON.stringify(event));
    return event.payload;
  }
}
