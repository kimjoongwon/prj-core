export interface PermissionWVBridgeEvent {
  type: 'Permission';
  actionType: 'camera' | 'photoLibrary';
  payload: {
    value: boolean;
  };
}
