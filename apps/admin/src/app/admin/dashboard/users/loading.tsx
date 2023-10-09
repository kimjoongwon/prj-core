'use client';

import { Skeleton } from '@nextui-org/react';

export default function Loading() {
  console.log('???');
  return (
    <Skeleton className="w-full rounded-lg">
      <div className="h-3 w-full rounded-lg bg-default-200"></div>
    </Skeleton>
  );
}
