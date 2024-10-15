'use client';

import { observer } from 'mobx-react-lite';
import { useSpacesTable } from './hooks/useSpacesTable';
import { CustomDataGridProps, DataGrid } from '../../ui';
import { SpaceDto } from '../../../model/spaceDto';

export interface SpacesTableProps extends CustomDataGridProps {
  spaces: SpaceDto[];
}

export const SpacesTable = observer((props: SpacesTableProps) => {
  const { spaces, state, ...rest } = props;
  const { columns, leftButtons, rightButtons } = useSpacesTable(props);

  return (
    <DataGrid
      {...rest}
      data={spaces}
      columns={columns}
      state={state}
      rightButtons={rightButtons}
      leftButtons={leftButtons}
    />
  );
});
