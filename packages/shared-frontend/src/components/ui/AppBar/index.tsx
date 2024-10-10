'use client';

import { AppBarView } from './AppBarView';

export interface AppBarProps {}

export const AppBar = (props: AppBarProps) => {
  return <AppBarView {...props} />;
};
