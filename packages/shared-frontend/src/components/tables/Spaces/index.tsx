'use client';

import { observer } from 'mobx-react-lite';
import { useProps } from './hooks/useProps';
import { DataGrid } from '../../ui';
import { SpaceDto } from '../../../model/spaceDto';

export interface SpacesTableProps {
  spaces: SpaceDto[];
}

export const SpacesTable = observer((props: SpacesTableProps) => {
  const { spaces } = props;
  const { columns, leftButtons, state, rightButtons } = useProps();

  return (
    <DataGrid
      selectionMode="multiple"
      data={spaces}
      columns={columns}
      state={state}
      rightButtons={rightButtons}
      leftButtons={leftButtons}
    />
  );
});
