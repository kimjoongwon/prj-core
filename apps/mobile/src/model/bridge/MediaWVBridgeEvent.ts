import {ImagePickerResponse} from 'react-native-image-picker';

export interface MediaWVBridgeEvent {
  type: 'Media';
  actionType: 'openCamera' | 'openGallery';
  payload: {
    value: ImagePickerResponse;
  };
}
