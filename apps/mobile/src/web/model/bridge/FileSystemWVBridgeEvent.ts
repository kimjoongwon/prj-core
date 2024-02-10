export interface FileSystemWVBridgeEvent {
  type: 'FileSystem';
  actionType: 'readFile';
  payload: {
    file?: string;
    filePath: string;
    options: any;
  };
}
