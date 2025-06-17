'use client';

import { observer } from 'mobx-react-lite';
import { TableLayoutProps } from '@shared/types';
import { VStack } from '../../ui/VStack/VStack';

export const TableLayout = observer((props: TableLayoutProps) => {
  const { children } = props;
  return <VStack className="p-4">{children}</VStack>;
});
