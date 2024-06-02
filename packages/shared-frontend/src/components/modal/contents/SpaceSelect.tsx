'use client';

import { observer } from 'mobx-react-lite';
import { useGetAllSpace } from '../../../apis';
import { myUniv } from '../../../providers';
import { ListBox } from '../../ui';

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
    <div>
      <ListBox
        onSelectionChange={handleSelectionChange}
        selectionMode="single"
        options={spaceOptions}
        state={myUniv.auth}
        path={'currentSpaceId'}
      />
    </div>
  );
});
