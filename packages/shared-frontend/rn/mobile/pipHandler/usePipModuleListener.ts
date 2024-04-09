import {useState, useEffect} from 'react';
import {Platform, EmitterSubscription} from 'react-native';

import PipHandler from './PipHandler';

export function usePipModeListener(): Boolean {
  const [isModeEnabled, setIsPipModeEnabled] = useState<Boolean>(false);

  useEffect(() => {
    let pipListener: EmitterSubscription | undefined;
    if (Platform.OS === 'android') {
      pipListener = PipHandler.onPipModeChanged(setIsPipModeEnabled);
    }

    return () => {
      pipListener?.remove();
    };
  }, []);

  return isModeEnabled;
}

export default usePipModeListener;
