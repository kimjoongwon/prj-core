import { makeAutoObservable, reaction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { UserDto } from '../../model/userDto';
type Dispatch = (Auth: string) => void;

type AuthProviderProps = { children: ReactNode; initialState?: string | null };

const AuthContext = createContext<string | null>(null);
const AuthDispatchContext = createContext<Dispatch | null>(null);

class AuthStore {
  constructor() {
    makeAutoObservable(this);
  }
  user: UserDto | undefined;
  accessToken: string | null = null;
}

export const authStore = new AuthStore();

const AuthProvider = observer(
  ({ children, initialState = null }: AuthProviderProps) => {
    const state = useLocalObservable(() => ({ accessToken: initialState }));

    useEffect(() => {
      const disposer = reaction(
        () => state.accessToken,
        accessToken => {
          authStore.accessToken = accessToken;
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
