import {SplashScreenWVBridgeEvent} from './SplashScreenWVBridgeEvent';
import {MediaWVBridgeEvent} from './MediaWVBridgeEvent';
import {PlatformWVBridgeEvent} from './PlatformWVBridgeEvent';
import {StorageWVBridgeEvent} from './StorageWVBridgeEvent';
import {AppWVBridgeEvent} from './AppWVBridgeEvent';
import {FileBrowserWVBridgeEvent} from './FileBroswerWVBridgeEvent';
import {FileSystemWVBridgeEvent} from './FileSystemWVBridgeEvent';
import {RNNavigationWVBridgeEvent} from './RNNavigationWVBridgeEvent';
import {OrientationWVBridgeEvent} from './OrientationWVBridgeEvent';
import {InAppBrowserWVBridgeEvent} from './InAppBrowserWVBridgeEvent';
import {RNConsoleWVBridgeEvent} from './RNConsoleWVBridgeEvent';
import {PermissionWVBridgeEvent} from './PermissionWVBridgeEvent';

export type BridgeEvent =
  | FileBrowserWVBridgeEvent
  | StorageWVBridgeEvent
  | SplashScreenWVBridgeEvent
  | PlatformWVBridgeEvent
  | MediaWVBridgeEvent
  | AppWVBridgeEvent
  | FileSystemWVBridgeEvent
  | RNNavigationWVBridgeEvent
  | OrientationWVBridgeEvent
  | InAppBrowserWVBridgeEvent
  | RNConsoleWVBridgeEvent
  | PermissionWVBridgeEvent;
