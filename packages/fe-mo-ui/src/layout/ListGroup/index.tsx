import { ListGroup as HeroListGroup, listGroupClassNames } from "heroui-native";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
	type ReactNode,
} from "react";
import { Text } from "../../data-display/Text";

type HeroListGroupProps = ComponentPropsWithoutRef<typeof HeroListGroup>;
type HeroListGroupItemProps = ComponentPropsWithoutRef<
	typeof HeroListGroup.Item
>;
type HeroListGroupItemTitleProps = ComponentPropsWithoutRef<
	typeof HeroListGroup.ItemTitle
>;
type HeroListGroupItemDescriptionProps = ComponentPropsWithoutRef<
	typeof HeroListGroup.ItemDescription
>;
export interface ListGroupItemConfig
	extends Omit<HeroListGroupItemProps, "children"> {
	description?: ReactNode;
	id: string;
	prefix?: ReactNode;
	suffix?: ReactNode;
	title: ReactNode;
}
export interface ListGroupProps extends HeroListGroupProps {
	items?: ListGroupItemConfig[];
}
export type ListGroupItemTitleProps = HeroListGroupItemTitleProps & {};
export type ListGroupItemDescriptionProps =
	HeroListGroupItemDescriptionProps & {};
const ListGroupComponent = forwardRef<
	ComponentRef<typeof HeroListGroup>,
	ListGroupProps
>(({ children, items, ...props }, ref) => (
	<HeroListGroup {...props} ref={ref}>
		{children ??
			items?.map(({ description, id, prefix, suffix, title, ...itemProps }) => (
				<HeroListGroup.Item {...itemProps} key={id}>
					{prefix && (
						<HeroListGroup.ItemPrefix>{prefix}</HeroListGroup.ItemPrefix>
					)}
					<HeroListGroup.ItemContent>
						<ListGroupItemTitle>{title}</ListGroupItemTitle>
						{description && (
							<ListGroupItemDescription>{description}</ListGroupItemDescription>
						)}
					</HeroListGroup.ItemContent>
					<HeroListGroup.ItemSuffix>{suffix}</HeroListGroup.ItemSuffix>
				</HeroListGroup.Item>
			))}
	</HeroListGroup>
));
ListGroupComponent.displayName = "ListGroup";
const ListGroupItemTitle = forwardRef<
	ComponentRef<typeof Text>,
	ListGroupItemTitleProps
>(({ children, className, ...props }, ref) => (
	<Text
		{...props}
		ref={ref}
		className={className}
		variant="label"
		weight="semibold"
	>
		{children}
	</Text>
));
ListGroupItemTitle.displayName = "ListGroup.ItemTitle";
const ListGroupItemDescription = forwardRef<
	ComponentRef<typeof Text>,
	ListGroupItemDescriptionProps
>(({ children, className, ...props }, ref) => (
	<Text {...props} ref={ref} className={className} tone="muted" variant="body">
		{children}
	</Text>
));
ListGroupItemDescription.displayName = "ListGroup.ItemDescription";
export const ListGroup = Object.assign(ListGroupComponent, {
	Item: HeroListGroup.Item,
	ItemContent: HeroListGroup.ItemContent,
	ItemDescription: ListGroupItemDescription,
	ItemPrefix: HeroListGroup.ItemPrefix,
	ItemSuffix: HeroListGroup.ItemSuffix,
	ItemTitle: ListGroupItemTitle,
}) as typeof ListGroupComponent &
	Pick<
		typeof HeroListGroup,
		"Item" | "ItemContent" | "ItemPrefix" | "ItemSuffix"
	> & {
		ItemDescription: typeof ListGroupItemDescription;
		ItemTitle: typeof ListGroupItemTitle;
	};
export { listGroupClassNames };
