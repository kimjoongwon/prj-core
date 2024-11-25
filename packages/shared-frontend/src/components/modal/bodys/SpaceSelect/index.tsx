'use client';

import { observer } from 'mobx-react-lite';
import { NavListBox } from '../../../ui';
import { galaxy } from '../../../../providers/App';
import { useGetSpacesByQuerySuspense } from '../../../../apis';

export const SpaceSelectModalBody = observer(() => {
  const { data } = useGetSpacesByQuerySuspense();

  const spaceOptions = data.data?.map(space => ({
    text: space.name,
    value: space.id,
  }));

  const handleSelectionChange = (value: any) => {
    localStorage.setItem('currentSpaceId', value);
  };

  return (
    <NavListBox
      onSelectionChange={handleSelectionChange}
      selectionMode="single"
      options={spaceOptions || []}
      state={galaxy.auth}
      path={'currentSpaceId'}
    />
  );
});
