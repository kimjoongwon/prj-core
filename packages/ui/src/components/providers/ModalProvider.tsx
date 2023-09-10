import React, { createContext } from 'react';

interface ModalProviderProps {
  children: React.ReactNode;
}

export function ModalProvider(props: ModalProviderProps) {
  return <div>{props.children}</div>;
}
