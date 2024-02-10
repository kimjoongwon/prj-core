export interface PermissionWVBridgeEvent {
  type: 'Permission';
  actionType: 'camera';
  payload?: {
    value: boolean;
  };
}
