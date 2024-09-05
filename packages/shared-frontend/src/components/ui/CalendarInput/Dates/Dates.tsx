import React from 'react';
import { useState } from '../_hooks/useState';
import { observer } from 'mobx-react-lite';
import { DatesView } from './DatesView';

interface DatesProps<T> {
  state: ReturnType<typeof useState>;
}

export const Dates = observer(<T extends object>(props: DatesProps<T>) => {
  const { state } = props;

  return <DatesView state={state} />;
});
