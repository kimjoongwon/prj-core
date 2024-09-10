import { reaction } from 'mobx';
import { useEffect } from 'react';
import { useState } from './useState';

export const useReactions = ({
  state,
}: {
  state: ReturnType<typeof useState>;
}) => {
  useEffect(() => {
    const stateTypeDisposer = reaction(
      () => state.type,
      () => {
        if (state.type === 'RECURRING') {
          if (state.repeatCycleType === 'DAY') {
          }
        }
      },
    );

    return () => {};
  }, []);
};
