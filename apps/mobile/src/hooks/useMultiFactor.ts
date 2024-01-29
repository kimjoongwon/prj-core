import {MultiFactor, RootStackParamList} from '@model';
import {NavigationProp} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {storage} from 'src/App';

export const useMultiFactor = (
  navigation: NavigationProp<RootStackParamList>,
) => {
  const [multiFactor, setMultiFactor] = useState<MultiFactor | undefined>(
    undefined,
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const _multiFactor = await storage.getMultiFactor();
      if (!_multiFactor) {
        console.log('multiFactor is undefined');
      }

      setMultiFactor(_multiFactor);
    });

    return unsubscribe;
  }, [multiFactor?.type, navigation]);

  const setMultiFactorWithStorage = useCallback(
    async (multiFactorWithStorage: MultiFactor) => {
      await storage.set('multi_factor', multiFactorWithStorage);
      setMultiFactor(multiFactorWithStorage);
    },
    [],
  );

  return {setMultiFactor, multiFactor, setMultiFactorWithStorage};
};
