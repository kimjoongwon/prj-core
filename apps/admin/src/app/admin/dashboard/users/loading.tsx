'use client';

import { SearchFilterContainer } from '@coc/ui';
import { Skeleton } from '@nextui-org/react';

export default function Loading() {
  console.log('동작?');
  return (
    <div>
      <Skeleton className="rounded-xl">
        <SearchFilterContainer>test</SearchFilterContainer>
      </Skeleton>
    </div>
  );
}
