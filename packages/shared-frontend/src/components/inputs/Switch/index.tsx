import { SwitchProps } from '@shared/types';
import { BaseSwitch } from './Switch';

export const Switch = BaseSwitch as <T extends object>(
  props: SwitchProps<T>,
) => ReturnType<typeof BaseSwitch>;
