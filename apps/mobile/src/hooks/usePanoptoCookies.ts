import CookieManager, {Cookies} from '@react-native-cookies/cookies';
import {useEffect, useState} from 'react';
import Config from 'react-native-config';

export const usePanoptoCookies = (isNotAuthPath: boolean) => {
  const [panoptoCookies, setPanoptoCookies] = useState<Cookies | undefined>(
    undefined,
  );

  useEffect(() => {
    const refresh = async () => {
      const cookies = await CookieManager.get(Config.PANOPTO_DOMAIN, true);
      console.log('panopto cookies', cookies);
      setPanoptoCookies(cookies);
    };
    refresh();
  }, [isNotAuthPath]);

  return {
    panoptoCookies,
  };
};
