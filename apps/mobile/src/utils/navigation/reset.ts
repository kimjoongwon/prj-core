import {RootStackParamList} from '@model';
import {navigationRef} from 'src/RootNavigation';

export function reset(
  name: keyof RootStackParamList,
  params?: RootStackParamList[keyof RootStackParamList],
) {
  if (navigationRef.isReady()) {
    // @ts-ignore
    navigationRef.reset({index: 0, routes: [{name, params}]});
  }
}
