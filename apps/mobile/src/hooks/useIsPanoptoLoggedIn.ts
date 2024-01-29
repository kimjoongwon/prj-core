import {Cookies} from '@react-native-cookies/cookies';
import {useEffect, useState} from 'react';

export const useIsPanoptoLoggedIn = (panoptoCookies?: Cookies) => {
  const [isPanoptoLoggedIn, setIsPanoptoLoggedIn] = useState(false);

  useEffect(() => {
    setIsPanoptoLoggedIn(!!panoptoCookies?.csrfToken?.value);
  }, [panoptoCookies]);

  return {
    isPanoptoLoggedIn,
  };
};
