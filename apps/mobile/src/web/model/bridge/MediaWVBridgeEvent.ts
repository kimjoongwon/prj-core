import { ImagePickerResponse } from './types/media';

export interface MediaWVBridgeEvent {
  type: 'Media';
  actionType: 'openCamera' | 'openGallery';
  payload?: {
    value: ImagePickerResponse;
  };
}
