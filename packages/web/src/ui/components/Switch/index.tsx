;

import { forwardRef } from 'react';
import { observer } from 'mobx-react-lite';
import { BaseSwitch, SwitchProps } from './Switch';

export const Switch = observer(forwardRef(BaseSwitch)) as <T extends object>(
  props: SwitchProps<T>,
) => ReturnType<typeof BaseSwitch>;
