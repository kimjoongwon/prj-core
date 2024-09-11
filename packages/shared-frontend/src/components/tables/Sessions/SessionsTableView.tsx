'use client';

import { SessionDto } from '../../../model/sessionDto';
import { DataGrid } from '../../ui';
import { useProps } from './hooks/useProps';

interface SessionsTableProps {
  sessions: SessionDto[];
}

export const SessionsTable = (props: SessionsTableProps) => {
  const { sessions } = props;
  const { columns, leftButtons, rightButtons, state } = useProps();

  return (
    <DataGrid
      selectionMode="multiple"
      data={sessions}
      columns={columns}
      state={state}
      rightButtons={rightButtons}
      leftButtons={leftButtons}
    />
  );
};
