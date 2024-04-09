import {useState, useEffect} from 'react';
import {Platform, EmitterSubscription} from 'react-native';

import PipHandler from './PipHandler';

export function usePipActionListener(): string {
  const [action, setAction] = useState<string>('');

  useEffect(() => {
    let pipListener: EmitterSubscription | undefined;
    if (Platform.OS === 'android') {
      pipListener = PipHandler.onPipActionChanged(setAction);
    }

    return () => {
      pipListener?.remove();
    };
  }, []);

  return action;
}

export default usePipActionListener;
