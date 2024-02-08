type DocumentPickerResponse = {
  uri: string;
  name: string | null;
  copyError?: string;
  fileCopyUri: string | null;
  type: string | null;
  size: number | null;
};

export interface FileBrowserWVBridgeEvent {
  type: 'FileBrowser';
  actionType: 'pick' | 'pickSingle';
  payload?: {
    value: DocumentPickerResponse | DocumentPickerResponse[];
  };
}
