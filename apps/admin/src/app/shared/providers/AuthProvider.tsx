import { authStore, getCurrentUser } from '@shared/frontend';
import { reaction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { createContext, ReactNode, useContext, useEffect } from 'react';
type Dispatch = (Auth: string) => void;

type AuthProviderProps = { children: ReactNode; initialState?: string | null };

const AuthContext = createContext<string | null>(null);
const AuthDispatchContext = createContext<Dispatch | null>(null);

const AuthProvider = observer(
  ({ children, initialState = null }: AuthProviderProps) => {
    const state = useLocalObservable(() => ({ accessToken: initialState }));

    useEffect(() => {
      const disposer = reaction(
        () => state.accessToken,
        accessToken => {

        },
      );

      return disposer;
    });

    return <>{children}</>;
  },
);

const useAuth = (): string | null => {
  return useContext<string | null>(AuthContext);
};

const useAuthDispatch = (): Dispatch => {
  const context = useContext<Dispatch | null>(AuthDispatchContext);

  if (context === null) {
    throw new Error('useAuthDispatch must be used within a AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth, useAuthDispatch };
