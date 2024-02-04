import {FileSystemWVBridgeEvent, Serializerable, WVEventHandler} from '@model';
import {Platform} from 'react-native';
import RNFS from 'react-native-fs';

export class FileSystem extends Serializerable implements WVEventHandler {
  async readFile(filePath?: string, encodingOrOptions?: any): Promise<string> {
    if (Platform.OS === 'ios') {
      const res = await RNFS.readFile(filePath || '', encodingOrOptions);

      return res;
    }

    const stat = await RNFS.stat(decodeURIComponent(filePath || ''));
    const res = await RNFS.readFile(stat.path || '', 'base64');
    return res;
  }

  async handleWVEvent(event: FileSystemWVBridgeEvent) {
    const payload: FileSystemWVBridgeEvent = {
      type: event.type,
      actionType: event.actionType,
      payload: {
        file: await this.readFile(event.payload?.filePath || ''),
        options: event.payload.options,
      },
    };

    this.sendMessageFromRNToWV(payload);
  }
}
