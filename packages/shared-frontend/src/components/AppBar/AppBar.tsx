'use client';

import { AppBarView } from './AppBarView';
export interface AppBarViewProps extends AppBarProps {}
interface AppBarProps {
  children?: React.ReactNode;
  content?: React.ReactNode;
}

export const AppBar = (props: AppBarProps) => {
  return <AppBarView {...props} />;
};
