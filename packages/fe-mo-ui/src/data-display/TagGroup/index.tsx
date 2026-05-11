import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import {
  TagGroup as HeroTagGroup,
  tagGroupClassNames,
  useTagGroup,
  useTagGroupItem,
} from "heroui-native/tag-group";
type HeroTagGroupProps = ComponentPropsWithoutRef<typeof HeroTagGroup>;
export type TagGroupProps = HeroTagGroupProps & {};
const TagGroupComponent = forwardRef<
  ComponentRef<typeof HeroTagGroup>,
  TagGroupProps
>((props, ref) => <HeroTagGroup {...props} ref={ref} />);
TagGroupComponent.displayName = "TagGroup";
export const TagGroup = Object.assign(
  TagGroupComponent,
  HeroTagGroup,
) as typeof HeroTagGroup;
export { tagGroupClassNames, useTagGroup, useTagGroupItem };
