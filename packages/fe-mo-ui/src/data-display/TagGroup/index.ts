import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import {
	TagGroup as HeroTagGroup,
	tagGroupClassNames,
	useTagGroup,
	useTagGroupItem,
} from "heroui-native/tag-group";

type HeroTagGroupProps = ComponentPropsWithoutRef<typeof HeroTagGroup>;

export type TagGroupProps = HeroTagGroupProps & {};

const TagGroupComponent = forwardRef<ElementRef<typeof HeroTagGroup>, TagGroupProps>(
	(props, ref) => createElement(HeroTagGroup, { ...props, ref }),
);

TagGroupComponent.displayName = "TagGroup";

export const TagGroup = Object.assign(
	TagGroupComponent,
	HeroTagGroup,
) as typeof HeroTagGroup;

export { tagGroupClassNames, useTagGroup, useTagGroupItem };
