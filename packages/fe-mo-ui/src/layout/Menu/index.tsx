import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactNode,
} from "react";
import {
  Menu as HeroMenu,
  menuClassNames,
  useMenu,
  useMenuAnimation,
  useMenuItem,
} from "heroui-native/menu";
import { getTextContent, Text } from "../../data-display/Text";
type HeroMenuProps = ComponentPropsWithoutRef<typeof HeroMenu>;
type HeroMenuContentProps = ComponentPropsWithoutRef<typeof HeroMenu.Content>;
type HeroMenuItemProps = ComponentPropsWithoutRef<typeof HeroMenu.Item>;
type HeroMenuItemTitleProps = ComponentPropsWithoutRef<
  typeof HeroMenu.ItemTitle
>;
type HeroMenuItemDescriptionProps = ComponentPropsWithoutRef<
  typeof HeroMenu.ItemDescription
>;
type HeroMenuOverlayProps = ComponentPropsWithoutRef<typeof HeroMenu.Overlay>;
type HeroMenuPortalProps = ComponentPropsWithoutRef<typeof HeroMenu.Portal>;
export interface MenuItemConfig extends Omit<HeroMenuItemProps, "children"> {
  description?: ReactNode;
  id: string;
  indicator?: ReactNode;
  title: ReactNode;
}
export interface MenuProps extends HeroMenuProps {
  contentProps?: HeroMenuContentProps;
  items?: MenuItemConfig[];
  overlayProps?: HeroMenuOverlayProps;
  portalProps?: HeroMenuPortalProps;
  trigger?: ReactNode;
}
export type MenuItemProps = HeroMenuItemProps & {};
export type MenuItemTitleProps = HeroMenuItemTitleProps & {};
export type MenuItemDescriptionProps = HeroMenuItemDescriptionProps & {};
const MenuComponent = forwardRef<ComponentRef<typeof HeroMenu>, MenuProps>(
  (
    {
      children,
      contentProps,
      items,
      overlayProps,
      portalProps,
      presentation = "popover",
      trigger,
      ...props
    },
    ref,
  ) => (
    <HeroMenu {...props} presentation={presentation} ref={ref}>
      {children ?? (
        <>
          {trigger && <HeroMenu.Trigger>{trigger}</HeroMenu.Trigger>}
          <HeroMenu.Portal {...portalProps}>
            <HeroMenu.Overlay {...overlayProps} />
            <HeroMenu.Content
              presentation={contentProps?.presentation ?? presentation}
              {...contentProps}
            >
              {items?.map(
                ({ description, id, indicator, title, ...itemProps }) => (
                  <MenuItem {...itemProps} id={id} key={id}>
                    <MenuItemTitle>{title}</MenuItemTitle>
                    {description && (
                      <MenuItemDescription>{description}</MenuItemDescription>
                    )}
                    {indicator && (
                      <HeroMenu.ItemIndicator>
                        {indicator}
                      </HeroMenu.ItemIndicator>
                    )}
                  </MenuItem>
                ),
              )}
            </HeroMenu.Content>
          </HeroMenu.Portal>
        </>
      )}
    </HeroMenu>
  ),
);
MenuComponent.displayName = "Menu";
const MenuItem = forwardRef<ComponentRef<typeof HeroMenu.Item>, MenuItemProps>(
  ({ children, ...props }, ref) => {
    const label =
      typeof children === "function" ? null : getTextContent(children);

    return (
      <HeroMenu.Item {...props} ref={ref}>
        {label === null ? children : <MenuItemTitle>{label}</MenuItemTitle>}
      </HeroMenu.Item>
    );
  },
);
MenuItem.displayName = "Menu.Item";
const MenuItemTitle = forwardRef<ComponentRef<typeof Text>, MenuItemTitleProps>(
  ({ children, className, ...props }, ref) => (
    <Text {...props} ref={ref} className={className} variant="label">
      {children}
    </Text>
  ),
);
MenuItemTitle.displayName = "Menu.ItemTitle";
const MenuItemDescription = forwardRef<
  ComponentRef<typeof Text>,
  MenuItemDescriptionProps
>(({ children, className, ...props }, ref) => (
  <Text {...props} ref={ref} className={className} tone="muted" variant="body">
    {children}
  </Text>
));
MenuItemDescription.displayName = "Menu.ItemDescription";
export const Menu = Object.assign(MenuComponent, {
  Close: HeroMenu.Close,
  Content: HeroMenu.Content,
  Group: HeroMenu.Group,
  Item: MenuItem,
  ItemDescription: MenuItemDescription,
  ItemIndicator: HeroMenu.ItemIndicator,
  ItemTitle: MenuItemTitle,
  Label: HeroMenu.Label,
  Overlay: HeroMenu.Overlay,
  Portal: HeroMenu.Portal,
  Trigger: HeroMenu.Trigger,
}) as typeof MenuComponent &
  Pick<
    typeof HeroMenu,
    | "Close"
    | "Content"
    | "Group"
    | "ItemIndicator"
    | "Label"
    | "Overlay"
    | "Portal"
    | "Trigger"
  > & {
    Item: typeof MenuItem;
    ItemDescription: typeof MenuItemDescription;
    ItemTitle: typeof MenuItemTitle;
  };
export { menuClassNames, useMenu, useMenuAnimation, useMenuItem };
