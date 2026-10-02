import {
	AccordionLayoutTransition,
	accordionClassNames,
	Accordion as HeroAccordion,
	useAccordion,
	useAccordionItem,
} from "heroui-native";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
	type ReactNode,
} from "react";
import { View } from "react-native";
import { getTextContent, Text } from "../../data-display/Text";

type HeroAccordionProps = ComponentPropsWithoutRef<typeof HeroAccordion>;
type HeroAccordionItemProps = ComponentPropsWithoutRef<
	typeof HeroAccordion.Item
>;
type HeroAccordionTriggerProps = ComponentPropsWithoutRef<
	typeof HeroAccordion.Trigger
>;
export interface AccordionItemConfig
	extends Omit<HeroAccordionItemProps, "children"> {
	content: ReactNode;
	title: ReactNode;
}
export interface AccordionProps extends HeroAccordionProps {
	items?: AccordionItemConfig[];
}
export type AccordionTriggerProps = HeroAccordionTriggerProps & {};
const AccordionComponent = forwardRef<
	ComponentRef<typeof HeroAccordion>,
	AccordionProps
>(({ children, items, ...props }, ref) => (
	<HeroAccordion {...props} ref={ref}>
		{children ??
			items?.map(({ content, title, value, ...itemProps }) => (
				<HeroAccordion.Item {...itemProps} key={String(value)} value={value}>
					<AccordionTrigger>{title}</AccordionTrigger>
					<HeroAccordion.Content>
						{typeof content === "string" || typeof content === "number" ? (
							<Text tone="muted">{content}</Text>
						) : (
							content
						)}
					</HeroAccordion.Content>
				</HeroAccordion.Item>
			))}
	</HeroAccordion>
));
AccordionComponent.displayName = "Accordion";
const AccordionTrigger = forwardRef<
	ComponentRef<typeof HeroAccordion.Trigger>,
	AccordionTriggerProps
>(({ children, ...props }, ref) => {
	const label = getTextContent(children);

	return (
		<HeroAccordion.Trigger {...props} ref={ref}>
			{label === null ? (
				children
			) : (
				// 저수준 layout 예외: heroui-native Accordion.Trigger slot에 끼워 넣는 label 행이라 raw gap을 유지합니다.
				<View className="flex-row items-center justify-between gap-3">
					<Text className="flex-1" variant="label">
						{label}
					</Text>
					<HeroAccordion.Indicator />
				</View>
			)}
		</HeroAccordion.Trigger>
	);
});
AccordionTrigger.displayName = "Accordion.Trigger";
export const Accordion = Object.assign(AccordionComponent, {
	Content: HeroAccordion.Content,
	Indicator: HeroAccordion.Indicator,
	Item: HeroAccordion.Item,
	Trigger: AccordionTrigger,
}) as typeof AccordionComponent &
	Pick<typeof HeroAccordion, "Content" | "Indicator" | "Item"> & {
		Trigger: typeof AccordionTrigger;
	};
export {
	AccordionLayoutTransition,
	accordionClassNames,
	useAccordion,
	useAccordionItem,
};
