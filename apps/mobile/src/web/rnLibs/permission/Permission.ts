import { PermissionWVBridgeEvent, Serializerable } from '../../model';

export class Permission extends Serializerable {
  private static instance: Permission;
  static getInstance() {
    if (!Permission.instance) {
      Permission.instance = new Permission();
    }
    return Permission.instance;
  }
  constructor() {
    super();
  }

  async camera() {
    const payload: PermissionWVBridgeEvent = {
      type: 'Permission',
      actionType: 'camera',
    };

    this.sendMessageFromWVToRN(payload);

    const mediaWVBridgeEvent =
      (await this.waitForMessage()) as PermissionWVBridgeEvent;

    return mediaWVBridgeEvent.payload?.value as boolean | undefined;
  }
}
