import { useEffect } from 'react';
import { Auth } from '../domains';

const useRefreshAuth = (auth: Auth) => {
  useEffect(() => {
    if (!auth.isLoggedIn) {
      auth.refreshing();
    }
  }, []);
};
