'use client';

import { observer } from 'mobx-react-lite';
import { VStack } from '../../VStack';

interface TableLayoutProps {
  children: React.ReactNode;
}

export const TableLayout = observer((props: TableLayoutProps) => {
  const { children } = props;
  return <VStack className="p-4">{children}</VStack>;
});
