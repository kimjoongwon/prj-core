import {navigationRef} from 'src/RootNavigation';

export function back() {
  if (navigationRef.isReady() || navigationRef.canGoBack()) {
    // @ts-ignore
    navigationRef.goBack();
  }
}
