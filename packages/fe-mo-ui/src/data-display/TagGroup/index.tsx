import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactNode,
} from "react";
import {
  TagGroup as HeroTagGroup,
  tagGroupClassNames,
  useTagGroup,
  useTagGroupItem,
} from "heroui-native/tag-group";
import { getTextContent, Text } from "../Text";
type HeroTagGroupProps = ComponentPropsWithoutRef<typeof HeroTagGroup>;
type HeroTagGroupItemProps = ComponentPropsWithoutRef<typeof HeroTagGroup.Item>;
type HeroTagGroupItemLabelProps = ComponentPropsWithoutRef<
  typeof HeroTagGroup.ItemLabel
>;
type HeroTagGroupListProps = ComponentPropsWithoutRef<typeof HeroTagGroup.List>;
export interface TagGroupItemConfig extends Omit<
  HeroTagGroupItemProps,
  "children"
> {
  label: ReactNode;
}
export interface TagGroupProps extends HeroTagGroupProps {
  items?: TagGroupItemConfig[];
  listProps?: HeroTagGroupListProps;
}
export type TagGroupItemProps = HeroTagGroupItemProps & {};
export type TagGroupItemLabelProps = HeroTagGroupItemLabelProps & {};
const TagGroupComponent = forwardRef<
  ComponentRef<typeof HeroTagGroup>,
  TagGroupProps
>(({ children, items, listProps, ...props }, ref) => (
  <HeroTagGroup {...props} ref={ref}>
    {children ?? (
      <HeroTagGroup.List {...listProps}>
        {items?.map(({ id, label, ...itemProps }) => (
          <TagGroupItem {...itemProps} id={id} key={String(id)}>
            {label}
          </TagGroupItem>
        ))}
      </HeroTagGroup.List>
    )}
  </HeroTagGroup>
));
TagGroupComponent.displayName = "TagGroup";
const TagGroupItem = forwardRef<
  ComponentRef<typeof HeroTagGroup.Item>,
  TagGroupItemProps
>(({ children, ...props }, ref) => {
  const label =
    typeof children === "function" ? null : getTextContent(children);
  return (
    <HeroTagGroup.Item {...props} ref={ref}>
      {label === null ? (
        children
      ) : (
        <TagGroupItemLabel>{label}</TagGroupItemLabel>
      )}
    </HeroTagGroup.Item>
  );
});
TagGroupItem.displayName = "TagGroup.Item";
const TagGroupItemLabel = forwardRef<
  ComponentRef<typeof Text>,
  TagGroupItemLabelProps
>(({ children, className, ...props }, ref) => (
  <Text {...props} ref={ref} className={className} variant="label">
    {children}
  </Text>
));
TagGroupItemLabel.displayName = "TagGroup.ItemLabel";
export const TagGroup = Object.assign(TagGroupComponent, {
  Item: TagGroupItem,
  ItemLabel: TagGroupItemLabel,
  ItemRemoveButton: HeroTagGroup.ItemRemoveButton,
  List: HeroTagGroup.List,
}) as typeof TagGroupComponent &
  Pick<typeof HeroTagGroup, "ItemRemoveButton" | "List"> & {
    Item: typeof TagGroupItem;
    ItemLabel: typeof TagGroupItemLabel;
  };
export { tagGroupClassNames, useTagGroup, useTagGroupItem };
