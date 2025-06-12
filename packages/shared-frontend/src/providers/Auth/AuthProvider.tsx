'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = observer((props: AuthProviderProps) => {
  const { children } = props;
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const checkAuth = (): boolean => {
    const cookies = document.cookie.split(';');
    const accessToken = cookies.find(cookie =>
      cookie.trim().startsWith('accessToken='),
    );
    const authenticated = !!accessToken;
    setIsAuthenticated(authenticated);
    return authenticated;
  };

  useEffect(() => {
    // 초기 인증 상태 확인
    checkAuth();

    // 주기적으로 인증 상태 확인 (실제로는 이벤트 기반으로 하는 것이 좋음)
    const interval = setInterval(checkAuth, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

AuthProvider.displayName = 'AuthProvider';
