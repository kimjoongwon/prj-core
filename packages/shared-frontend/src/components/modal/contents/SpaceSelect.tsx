'use client';

import { observer } from 'mobx-react-lite';
import { ListBox } from '../../ui';
import { galaxy } from '../../../providers/App';
import {
  getSpacesByQuery,
  useGetSpacesByQuery,
  useGetSpacesByQuerySuspense,
} from '../../../apis';

export const SpaceSelectModalContent = observer(() => {
  const { data } = useGetSpacesByQuerySuspense();

  const spaceOptions = data.data?.map(space => ({
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
      options={spaceOptions || []}
      state={galaxy.auth}
      path={'currentSpaceId'}
    />
  );
});
