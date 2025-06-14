'use client';

import { observer } from 'mobx-react-lite';
import { VStack } from '../../VStack';
import { TableLayoutProps } from '@shared/types';

export const TableLayout = observer((props: TableLayoutProps) => {
  const { children } = props;
  return <VStack className="p-4">{children}</VStack>;
});
