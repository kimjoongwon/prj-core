'use client';

import { Paths } from '../../../constants';
import { BottomTabView } from './BottomTabView';

interface Route {
  name: string;
  pathname: Paths;
  params?: object;
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
