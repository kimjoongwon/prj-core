'use client';

import { BaseSwitch, SwitchProps } from './Switch';

export const Switch = BaseSwitch as <T extends object>(
  props: SwitchProps<T>,
) => ReturnType<typeof BaseSwitch>;
