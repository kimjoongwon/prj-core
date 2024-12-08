'use client';

import { observer } from 'mobx-react-lite';
import { BottomTabView } from './BottomTabView';
import { BottomTabProps } from '../../../types/components';

export const BottomTab = observer((props: BottomTabProps) => {
  return <BottomTabView {...props} />;
});
