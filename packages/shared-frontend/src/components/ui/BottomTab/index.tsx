'use client';

import { BottomTabView } from './BottomTabView';

interface Route {
  name: string;
  isVisible?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  children?: Route[];
}

export interface BottomTabProps {
  tabs: Route[];
}

export const BottomTab = (props: BottomTabProps) => {
  return <BottomTabView {...props} />;
};
