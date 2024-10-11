'use client';

import { AccessorKeyColumnDef } from '@tanstack/react-table';
import { SessionDto } from '../../../model/sessionDto';
import { CustomDataGridProps, DataGrid, DataGridState } from '../../ui';
import { useProps } from './hooks/useProps';

interface SessionsTableProps extends CustomDataGridProps {
  sessions: SessionDto[];
  state?: DataGridState;
  leftButtonsHide?: boolean;
  rightButtonsHide?: boolean;
  columns?: AccessorKeyColumnDef<SessionDto, string>[];
}

export const SessionsTable = (props: SessionsTableProps) => {
  const {
    sessions,
    leftButtonsHide,
    rightButtonsHide,
    leftButtons = [],
    rightButtons = [],
    columns = [],
  } = props;

  const {
    columns: _columns,
    leftButtons: _leftButtons,
    rightButtons: _rightButtons,
    state,
  } = useProps();

  return (
    <DataGrid
      hideHeader
      data={sessions}
      columns={_columns.concat(columns)}
      state={state}
      rightButtons={leftButtonsHide ? [] : rightButtons.concat(_rightButtons)}
      leftButtons={rightButtonsHide ? [] : leftButtons.concat(_leftButtons)}
    />
  );
};
