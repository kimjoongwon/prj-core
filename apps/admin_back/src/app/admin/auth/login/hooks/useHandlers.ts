import { AuthStatus, galaxy } from '@shared/frontend';
import { useState } from './useState';

export const useHandlers = (context: {
  state: ReturnType<typeof useState>;
}) => {
  const { state } = context;

  return {
    onClickLogin: () => galaxy?.auth.login(state),
    getDisabled: () => galaxy.auth.status === AuthStatus.LoggingIn,
    getLoading: () => galaxy.auth.status === AuthStatus.LoggingIn,
  };
};
