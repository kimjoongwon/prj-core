import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import {
  ListGroup as HeroListGroup,
  listGroupClassNames,
} from "heroui-native/list-group";
type HeroListGroupProps = ComponentPropsWithoutRef<typeof HeroListGroup>;
export type ListGroupProps = HeroListGroupProps & {};
const ListGroupComponent = forwardRef<
  ComponentRef<typeof HeroListGroup>,
  ListGroupProps
>((props, ref) => <HeroListGroup {...props} ref={ref} />);
ListGroupComponent.displayName = "ListGroup";
export const ListGroup = Object.assign(
  ListGroupComponent,
  HeroListGroup,
) as typeof HeroListGroup;
export { listGroupClassNames };
