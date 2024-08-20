'use client';

import { observer } from 'mobx-react-lite';
import { useGetAllSpace } from '../../../apis';
import { ListBox } from '../../ui';
import { galaxy } from '../../../providers/App';

export const SpaceSelectModalContent = observer(() => {
  const { data: spaces = [] } = useGetAllSpace();

  const spaceOptions = spaces?.map(space => ({
    text: space.name,
    value: space.id,
  }));

  const handleSelectionChange = (value: any) => {
    localStorage.setItem('currentSpaceId', value);
  };

  return (
    <ListBox
      onSelectionChange={handleSelectionChange}
      selectionMode="single"
      options={spaceOptions}
      state={galaxy.auth}
      path={'currentSpaceId'}
    />
  );
});
