import { createContext, useContext } from 'react';

export interface StateProviderProps<T> {
  children: React.ReactNode;
  state: T;
}

const Context = createContext<unknown>(undefined);

export const StateProvider = <T extends any>(props: StateProviderProps<T>) => {
  const { state } = props;
  return <Context.Provider value={state}>{props.children}</Context.Provider>;
};

export const usePageState = <T extends any>() => {
  return useContext(Context) as T;
};
