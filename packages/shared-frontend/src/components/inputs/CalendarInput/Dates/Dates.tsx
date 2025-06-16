import { useState } from '../_hooks/useState';
import { observer } from 'mobx-react-lite';
import { DatesView } from './DatesView';

interface DatesProps {
  state: ReturnType<typeof useState>;
}

export const Dates = observer((props: DatesProps) => {
  const { state } = props;

  return <DatesView state={state} />;
});
