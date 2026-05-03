import { createElement, type ComponentPropsWithoutRef } from "react";
import {
	SkeletonGroup as HeroSkeletonGroup,
	skeletonGroupClassNames,
} from "heroui-native/skeleton-group";

type HeroSkeletonGroupProps = ComponentPropsWithoutRef<typeof HeroSkeletonGroup>;

export type SkeletonGroupProps = HeroSkeletonGroupProps & {};

const SkeletonGroupComponent = (props: SkeletonGroupProps) =>
	createElement(HeroSkeletonGroup, props);

SkeletonGroupComponent.displayName = "SkeletonGroup";

export const SkeletonGroup = Object.assign(
	SkeletonGroupComponent,
	HeroSkeletonGroup,
) as typeof HeroSkeletonGroup;

export { skeletonGroupClassNames };
