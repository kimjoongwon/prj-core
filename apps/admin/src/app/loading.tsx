'use client';

import { CircularProgress } from '@nextui-org/react';

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="absolute left-1/2 top-1/2">
      <CircularProgress />
    </div>
  );
}
