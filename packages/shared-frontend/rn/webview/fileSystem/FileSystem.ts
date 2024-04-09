import { FileSystemWVBridgeEvent, Serializerable } from '../../model';

export class FileSystem extends Serializerable {
  private static instance: FileSystem;
  constructor() {
    super();
  }

  static getInstance() {
    if (!FileSystem.instance) {
      FileSystem.instance = new FileSystem();
    }
    return FileSystem.instance;
  }

  async readFile(filePath: string, options?: any) {
    const payload: FileSystemWVBridgeEvent = {
      type: 'FileSystem',
      actionType: 'readFile',
      payload: {
        filePath,
        options,
      },
    };

    this.sendMessageFromWVToRN(payload);

    const event = (await this.waitForMessage()) as FileSystemWVBridgeEvent;
    return event?.payload;
  }
}
