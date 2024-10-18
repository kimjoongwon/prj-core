import { useState } from './useState';
import { reaction } from 'mobx';

export const useReactions = (context: {
  state: ReturnType<typeof useState>;
}) => {
  const { state } = context;

  reaction(
    () => state.form.type,
    () => {
      state.form.startDate = null;
      state.form.endDate = null;
      state.form.repeatCycle = 1;
    },
  )();
};
