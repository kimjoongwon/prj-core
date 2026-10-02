import {
	SubMenu as HeroSubMenu,
	subMenuClassNames,
	useSubMenu,
} from "heroui-native";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
	type ReactNode,
} from "react";
import { View } from "react-native";
import { getTextContent, Text } from "../../data-display/Text";

type HeroSubMenuProps = ComponentPropsWithoutRef<typeof HeroSubMenu>;
type HeroSubMenuContentProps = ComponentPropsWithoutRef<
	typeof HeroSubMenu.Content
>;
type HeroSubMenuTriggerProps = ComponentPropsWithoutRef<
	typeof HeroSubMenu.Trigger
>;
export interface SubMenuProps extends HeroSubMenuProps {
	content?: ReactNode;
	contentProps?: HeroSubMenuContentProps;
	title?: ReactNode;
	triggerProps?: HeroSubMenuTriggerProps;
}
export type SubMenuTriggerProps = HeroSubMenuTriggerProps & {};
const SubMenuComponent = forwardRef<
	ComponentRef<typeof HeroSubMenu>,
	SubMenuProps
>(({ children, content, contentProps, title, triggerProps, ...props }, ref) => {
	const hasScaffold = title || content || contentProps || triggerProps;

	return (
		<HeroSubMenu {...props} ref={ref}>
			{hasScaffold ? (
				<>
					<SubMenuTrigger {...triggerProps}>{title}</SubMenuTrigger>
					<HeroSubMenu.Content {...contentProps}>{content}</HeroSubMenu.Content>
				</>
			) : (
				children
			)}
		</HeroSubMenu>
	);
});
SubMenuComponent.displayName = "SubMenu";
const SubMenuTrigger = forwardRef<
	ComponentRef<typeof HeroSubMenu.Trigger>,
	SubMenuTriggerProps
>(({ children, ...props }, ref) => {
	const label = getTextContent(children);

	return (
		<HeroSubMenu.Trigger {...props} ref={ref}>
			{label === null ? (
				children
			) : (
				// 저수준 layout 예외: heroui-native SubMenu.Trigger slot에 끼워 넣는 label 행이라 raw gap을 유지합니다.
				<View className="flex-row items-center justify-between gap-3">
					<Text className="flex-1" variant="label">
						{label}
					</Text>
					<HeroSubMenu.TriggerIndicator />
				</View>
			)}
		</HeroSubMenu.Trigger>
	);
});
SubMenuTrigger.displayName = "SubMenu.Trigger";
export const SubMenu = Object.assign(SubMenuComponent, {
	Content: HeroSubMenu.Content,
	Trigger: SubMenuTrigger,
	TriggerIndicator: HeroSubMenu.TriggerIndicator,
}) as typeof SubMenuComponent &
	Pick<typeof HeroSubMenu, "Content" | "TriggerIndicator"> & {
		Trigger: typeof SubMenuTrigger;
	};
export { subMenuClassNames, useSubMenu };
