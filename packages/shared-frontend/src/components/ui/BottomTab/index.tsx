'use client';

import { observer } from 'mobx-react-lite';
import { BottomTabView } from './BottomTabView';
import { BottomTabProps } from '@shared/types';

export const BottomTab = observer((props: BottomTabProps) => {
  return <BottomTabView {...props} />;
});
