import { galaxy } from '@shared/frontend';
import { useState } from './useState';
import { Effect } from 'effect';
import { AuthStatus } from '@shared/frontend/src/store/auth';
import { get } from 'http';

export const useHandlers = (context: {
  state: ReturnType<typeof useState>;
}) => {
  const { state } = context;

  return {
    onClickLogin: () => {
      Effect.runPromise(galaxy?.auth.login(state));
    },
    getDisabled: () => galaxy.auth.status === AuthStatus.LoggingIn,
    getLoading: () => galaxy.auth.status === AuthStatus.LoggingIn,
  };
};
