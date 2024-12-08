'use client';

import { AppBarView } from './AppBarView';
import { AppBarProps } from '../../../types/components';

export const AppBar = (props: AppBarProps) => {
  return <AppBarView {...props} />;
};
