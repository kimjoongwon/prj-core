'use client';

import { observer } from 'mobx-react-lite';

interface TableContainerProps {
  children: React.ReactNode;
}
export const TableContainer = observer((props: TableContainerProps) => {
  const { children } = props;
  return <div className="space-y-4 p-20">{children}</div>;
});
