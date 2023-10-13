import { SkeletonProps, Skeleton as NextSkeleton } from '@nextui-org/react';

export const Skeleton = (props: SkeletonProps) => {
  return <NextSkeleton className="rounded-medium" {...props} />;
};
