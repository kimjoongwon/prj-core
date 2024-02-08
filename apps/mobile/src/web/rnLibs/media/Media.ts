import { MediaWVBridgeEvent, Serializerable } from '../../model';
import { ImagePickerResponse } from '../../model/bridge/types/media';

export class Media extends Serializerable {
  private static instance: Media;
  static getInstance() {
    if (!Media.instance) {
      Media.instance = new Media();
    }
    return Media.instance;
  }
  constructor() {
    super();
  }

  async openGallery() {
    const payload: MediaWVBridgeEvent = {
      type: 'Media',
      actionType: 'openGallery',
    };
    this.sendMessageFromWVToRN(payload);

    const mediaWVBridgeEvent =
      (await this.waitForMessage()) as MediaWVBridgeEvent;

    return mediaWVBridgeEvent.payload?.value as ImagePickerResponse;
  }

  async openCamera() {
    const payload: MediaWVBridgeEvent = {
      type: 'Media',
      actionType: 'openCamera',
    };

    this.sendMessageFromWVToRN(payload);

    const mediaWVBridgeEvent =
      (await this.waitForMessage()) as MediaWVBridgeEvent;
    return mediaWVBridgeEvent.payload?.value as ImagePickerResponse;
  }
}
