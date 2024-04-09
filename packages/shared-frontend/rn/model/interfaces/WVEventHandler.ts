import {BridgeEvent} from '../bridge/BridgeEvent';

export interface WVEventHandler {
  handleWVEvent(event: BridgeEvent): void;
}
