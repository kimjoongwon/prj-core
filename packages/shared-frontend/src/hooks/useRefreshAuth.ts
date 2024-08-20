import { useEffect } from 'react';
import { Auth } from '../store';

const useRefreshAuth = (auth: Auth) => {
  useEffect(() => {
    if (!auth.isLoggedIn) {
      auth.refreshing();
    }
  }, []);
};
