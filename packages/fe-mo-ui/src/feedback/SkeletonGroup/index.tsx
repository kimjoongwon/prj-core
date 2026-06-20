import {
	SkeletonGroup as HeroSkeletonGroup,
	skeletonGroupClassNames,
} from "heroui-native";
import { type ComponentPropsWithoutRef } from "react";

type HeroSkeletonGroupProps = ComponentPropsWithoutRef<
	typeof HeroSkeletonGroup
>;
export type SkeletonGroupProps = HeroSkeletonGroupProps & {};
const SkeletonGroupComponent = (props: SkeletonGroupProps) => (
	<HeroSkeletonGroup {...props} />
);
SkeletonGroupComponent.displayName = "SkeletonGroup";
export const SkeletonGroup = Object.assign(
	SkeletonGroupComponent,
	HeroSkeletonGroup,
) as typeof HeroSkeletonGroup;
export { skeletonGroupClassNames };
