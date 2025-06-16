import { observer } from 'mobx-react-lite';
import { DateView } from './DateView';
import { DateModel } from '@shared/types';

export interface DateProps {
  state: DateModel;
}

export const Date = observer((props: DateProps) => {
  const { state } = props;

  return <DateView state={state} />;
});
