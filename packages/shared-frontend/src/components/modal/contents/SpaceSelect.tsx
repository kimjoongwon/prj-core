'use client';

import { useGetAllSpace } from '../../../apis';
import { useApp } from '../../../providers';
import { ListBox } from '../../ui';

export const SpaceSelectModalContent = () => {
  const { auth } = useApp();
  const { data: spaces = [] } = useGetAllSpace();

  const spaceOptions = spaces?.map(space => ({
    text: space.name,
    value: space.id,
  }));

  return (
    <ListBox
      selectionMode="single"
      options={spaceOptions}
      state={auth}
      path={'currentSpaceId'}
    />
  );
};
