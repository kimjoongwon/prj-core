import RNFS, {StatResult} from 'react-native-fs';

export interface FileSystemWVBridgeEvent {
  type: 'FileSystem';
  actionType: keyof typeof RNFS;
  payload: {
    file: string | StatResult;
    filePath?: string;
    options: any;
  };
}
