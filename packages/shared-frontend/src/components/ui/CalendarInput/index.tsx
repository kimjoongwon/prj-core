'use client';

import { observer } from 'mobx-react-lite';
import { CalendarInputView } from './CalendarInputView';
import { useProps } from './_hooks/useProps';
import { CalendarInputProps } from './_types';

export const CalendarInput = observer(
  <T extends object>(props: CalendarInputProps<T>) => {
    const { state } = useProps(props);

    return (
      <div>
        <CalendarInputView state={state} />
      </div>
    );
  },
);
