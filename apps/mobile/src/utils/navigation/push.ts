import {RootStackParamList} from '@model';
import {navigationRef} from 'src/RootNavigation';

export function push(
  name: keyof RootStackParamList,
  params?: RootStackParamList[keyof RootStackParamList],
) {
  if (navigationRef.isReady()) {
    // @ts-ignore
    navigationRef.push(name, params);
  }
}
