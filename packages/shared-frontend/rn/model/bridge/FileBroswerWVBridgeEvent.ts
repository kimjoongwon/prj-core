import {DocumentPickerResponse} from 'react-native-document-picker';

export interface FileBrowserWVBridgeEvent {
  type: 'FileBrowser';
  actionType: 'pick' | 'pickSingle';
  payload?: {
    value: DocumentPickerResponse | DocumentPickerResponse[];
  };
}
