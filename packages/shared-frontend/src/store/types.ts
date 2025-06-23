import { type NavigationStore } from './navigationStore';
import { type NavigatorStore } from './navigatorStore';
import { type AuthStore } from './authStore';

/**
 * PlateStore 인터페이스 - 순환 참조 방지를 위해 분리
 */
export interface IPlateStore {
  name: string;
  isInitialized: boolean;
  navigation: NavigationStore;
  navigator: NavigatorStore;
  auth: AuthStore;
}
