import { type ComponentPropsWithoutRef } from "react";
import {
  Skeleton as HeroSkeleton,
  skeletonClassNames,
} from "heroui-native";
type HeroSkeletonProps = ComponentPropsWithoutRef<typeof HeroSkeleton>;
export type SkeletonProps = HeroSkeletonProps & {};
const SkeletonComponent = (props: SkeletonProps) => <HeroSkeleton {...props} />;
SkeletonComponent.displayName = "Skeleton";
export const Skeleton = Object.assign(
  SkeletonComponent,
  HeroSkeleton,
) as typeof HeroSkeleton;
export { skeletonClassNames };
