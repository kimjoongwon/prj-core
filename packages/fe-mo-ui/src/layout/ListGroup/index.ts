import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import { ListGroup as HeroListGroup, listGroupClassNames } from "heroui-native/list-group";

type HeroListGroupProps = ComponentPropsWithoutRef<typeof HeroListGroup>;

export type ListGroupProps = HeroListGroupProps & {};

const ListGroupComponent = forwardRef<
	ElementRef<typeof HeroListGroup>,
	ListGroupProps
>((props, ref) => createElement(HeroListGroup, { ...props, ref }));

ListGroupComponent.displayName = "ListGroup";

export const ListGroup = Object.assign(
	ListGroupComponent,
	HeroListGroup,
) as typeof HeroListGroup;

export { listGroupClassNames };
