import { SplashScreenWVBridgeEvent } from './SplashScreenWVBridgeEvent';
import { PlatformWVBridgeEvent } from './PlatformWVBridgeEvent';
import { StorageWVBridgeEvent } from './StorageWVBridgeEvent';
import { MediaWVBridgeEvent } from './MediaWVBridgeEvent';
import { AppWVBridgeEvent } from './AppWVBridgeEvent';
import { RNNavigationWVBridgeEvent } from './RNNavigationWVBridgeEvent';
import { FileSystemWVBridgeEvent } from './FileSystemWVBridgeEvent';
import { FileBrowserWVBridgeEvent } from './FileBrowserWVBridgeEvent';
import { InAppBrowserWVBridgeEvent } from './InAppBrowserWVBridgeEvent';
import { PermissionWVBridgeEvent } from './PermissionWVBridgeEvent';

export type RNConsoleWVBridgeEvent = {
  type: 'RNConsole';
  actionType: 'log';
  payload: {
    tag?: string;
    message?: string;
  };
};
export type BridgeEvent =
  | StorageWVBridgeEvent
  | SplashScreenWVBridgeEvent
  | PlatformWVBridgeEvent
  | MediaWVBridgeEvent
  | AppWVBridgeEvent
  | RNNavigationWVBridgeEvent
  | FileSystemWVBridgeEvent
  | FileBrowserWVBridgeEvent
  | InAppBrowserWVBridgeEvent
  | RNConsoleWVBridgeEvent
  | PermissionWVBridgeEvent;
