import CookieManager, {Cookies} from '@react-native-cookies/cookies';
import {useEffect, useState} from 'react';
import Config from 'react-native-config';

export const useMySUNICookies = (isNotAuthPath: boolean) => {
  const [mySUNICookies, setMySUNICookies] = useState<Cookies | undefined>(
    undefined,
  );

  useEffect(() => {
    const getMySUNICookies = async () => {
      const cookies = await CookieManager.get(Config.APP_DOMAIN, true);
      console.log('cookies', cookies);
      setMySUNICookies(cookies);
    };

    if (!isNotAuthPath) {
      getMySUNICookies();
    }
  }, [isNotAuthPath]);

  return {
    mySUNICookies,
  };
};
