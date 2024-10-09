'use client';

import { observer } from 'mobx-react-lite';
import { useProps } from './hooks/useProps';
import { DataGrid, DataGridState } from '../../ui';
import { SpaceDto } from '../../../model/spaceDto';
import { TableProps } from '@nextui-org/react';

export interface SpacesTableProps extends TableProps {
  spaces: SpaceDto[];
  state: DataGridState;
}

export const SpacesTable = observer((props: SpacesTableProps) => {
  const { spaces, state, ...rest } = props;
  const { columns, leftButtons, rightButtons } = useProps();
  console.log(state.selectedKeys, 'render?');
  return (
    <DataGrid
      {...rest}
      hideHeader
      data={spaces}
      columns={columns}
      state={state}
      rightButtons={rightButtons}
      leftButtons={leftButtons}
    />
  );
});
