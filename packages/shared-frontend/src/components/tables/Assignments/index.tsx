'use client';

import { TableProps } from '@nextui-org/react';
import { AssignmentDto } from '../../../model/assignmentDto';
import { CustomDataGridProps, DataGrid, DataGridState } from '../../ui';
import { useAssignmentsTables } from './_hooks/useAssignmentsTable';
import { observer } from 'mobx-react-lite';

export interface AssignmentsTableProps extends CustomDataGridProps {
  assignments: AssignmentDto[];
}

export const AssignmentsTable = observer((props: AssignmentsTableProps) => {
  const { assignments = [], state, ...rest } = props;
  const { columns, rightButtons, leftButtons } = useAssignmentsTables(props);

  return (
    <DataGrid
      {...rest}
      rightButtons={rightButtons}
      leftButtons={leftButtons}
      data={assignments}
      columns={columns}
      state={state}
    />
  );
});
