'use client';

import { AppBarView } from './AppBarView';
import { AppBarProps } from '@shared/types';

export const AppBar = (props: AppBarProps) => {
  return <AppBarView {...props} />;
};
