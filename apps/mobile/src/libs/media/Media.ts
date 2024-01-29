import {Serializerable, WVEventHandler} from '@model';
import {RefObject} from 'react';
import {
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import WebView from 'react-native-webview';
import {MediaWVBridgeEvent} from 'src/model/bridge/MediaWVBridgeEvent';

export class Media extends Serializerable implements WVEventHandler {
  private static instance: Media;

  private constructor(webviewRef: RefObject<WebView>) {
    super(webviewRef);
  }

  static getInstance(webviewRef: RefObject<WebView>): Media {
    if (!Media.instance) {
      Media.instance = new Media(webviewRef);
    }
    return Media.instance;
  }

  openCamera(options: ImageLibraryOptions) {
    return launchCamera(options);
  }

  openGallery(options: ImageLibraryOptions) {
    return launchImageLibrary(options);
  }

  async handleWVEvent(event: MediaWVBridgeEvent) {
    let payload = {} as MediaWVBridgeEvent;
    if (event.actionType === 'openCamera') {
      payload = {
        type: 'Media',
        actionType: 'openCamera',
        payload: {
          value: await this.openCamera({
            mediaType: 'photo',
            includeBase64: true,
          }),
        },
      };
    }

    if (event.actionType === 'openGallery') {
      payload = {
        type: 'Media',
        actionType: 'openGallery',
        payload: {
          value: await this.openGallery({
            mediaType: 'photo',
            includeBase64: true,
          }),
        },
      };
    }

    return this.sendMessageFromRNToWV(payload);
  }
}
