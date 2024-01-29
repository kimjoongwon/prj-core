import {Cookies} from '@react-native-cookies/cookies';
import {useEffect, useState} from 'react';

export const useIsUserLoggedIn = (mySUNICookies?: Cookies) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
      setIsUserLoggedIn(!!mySUNICookies?.JSESSIONID?.value);
    };
    checkLoggedIn();
  }, [mySUNICookies]);

  return {
    isUserLoggedIn,
  };
};
