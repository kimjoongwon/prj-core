import { useEffect } from 'react';
import { Auth } from '../services/auth';

const useRefreshAuth = (auth: Auth) => {
  useEffect(() => {
    if (!auth.isLoggedIn) {
      auth.refreshing();
    }
  }, []);
};
