export interface OrientationWVBridgeEvent {
  type: 'Orientation';
  actionType: 'unlock' | 'lockPortrait' | 'lockLandscape';
}
