import { type ReactNode } from "react";
import {
	type StyleProp,
	Text,
	View,
	type ViewProps,
	type ViewStyle,
} from "react-native";
import { tv } from "tailwind-variants";
import { Chip, chipClassNames, type ChipProps } from "../../data-display/Chip";
import { Icon, type MobileIconName } from "../../icon";
import { HStack, VStack } from "../../rhythm";
import { PureRadio } from "../Radio/Radio";
export interface SelectableCardItem {
	description?: ReactNode;
	disabledReason?: ReactNode;
	eyebrow?: ReactNode;
	iconName?: MobileIconName;
	isDisabled?: boolean;
	meta?: readonly ReactNode[];
	tags?: readonly ReactNode[];
	title: ReactNode;
	value: string;
}
export interface PureSelectableCardListProps
	extends Omit<ViewProps, "children"> {
	cardStyle?: StyleProp<ViewStyle>;
	description?: ReactNode;
	disabled?: boolean;
	emptyContent?: ReactNode;
	emptyLabel?: ReactNode;
	items?: readonly SelectableCardItem[];
	onSelect?: (value: string) => void;
	selectLabel?: ReactNode;
	selectedCardStyle?: StyleProp<ViewStyle>;
	selectedLabel?: ReactNode;
	selectedValue?: string | null;
	title?: ReactNode;
}
interface SelectableCardConfig {
	cardStyle?: StyleProp<ViewStyle>;
	disabled?: boolean;
	onSelect?: (value: string) => void;
	selectLabel?: ReactNode;
	selectedCardStyle?: StyleProp<ViewStyle>;
	selectedLabel?: ReactNode;
	selectedValue?: string | null;
}
const toAccessibleText = (value: ReactNode) => {
	if (typeof value === "string" || typeof value === "number") {
		return String(value);
	}
	return undefined;
};
const getDisplayNodeKey = (
	scope: string,
	ownerValue: string,
	node: ReactNode,
	position: number,
) => {
	const accessibleText = toAccessibleText(node);
	if (accessibleText) {
		return `${scope}-${ownerValue}-${accessibleText}`;
	}
	return `${scope}-${ownerValue}-position-${position}`;
};
const createSelectHandler = (
	item: SelectableCardItem,
	config: SelectableCardConfig,
) => {
	if (config.disabled || item.isDisabled) {
		return undefined;
	}
	return () => {
		config.onSelect?.(item.value);
	};
};
const NodeText = ({
	className,
	node,
}: {
	className?: string;
	node: ReactNode;
}) => {
	if (node === undefined || node === null || node === false) {
		return null;
	}
	return <Text className={className}>{node}</Text>;
};
const SelectableTag = ({ tag }: { tag: ReactNode }) => (
	<View className={classNames.tag()}>
		<Text className={classNames.tagText()}>{tag}</Text>
	</View>
);
const SelectableMeta = ({ meta }: { meta: ReactNode }) => (
	<Text className={classNames.metaText()}>{meta}</Text>
);
const SelectableTitleIcon = ({ item }: { item: SelectableCardItem }) => {
	if (!item.iconName) {
		return null;
	}
	return (
		<View className={classNames.titleIcon()}>
			<Icon name={item.iconName} size="sm" tone="accent" />
		</View>
	);
};
const SelectableTags = ({ item }: { item: SelectableCardItem }) => {
	if (!item.tags?.length) {
		return null;
	}
	return (
		<HStack className="flex-wrap" gap="inline">
			{item.tags.map((tag, index) => {
				const tagKey = getDisplayNodeKey("tag", item.value, tag, index);
				return <SelectableTag key={tagKey} tag={tag} />;
			})}
		</HStack>
	);
};
const SelectableMetaList = ({ item }: { item: SelectableCardItem }) => {
	if (!item.meta?.length) {
		return null;
	}
	return (
		<HStack className="flex-wrap" gap="inline">
			{item.meta.map((meta, index) => {
				const metaKey = getDisplayNodeKey("meta", item.value, meta, index);
				return <SelectableMeta key={metaKey} meta={meta} />;
			})}
		</HStack>
	);
};
const DisabledReasonText = ({ item }: { item: SelectableCardItem }) => {
	if (!item.isDisabled || !item.disabledReason) {
		return null;
	}
	return (
		<Text className={classNames.disabledReason()}>{item.disabledReason}</Text>
	);
};
type SelectionChipColor = NonNullable<ChipProps["color"]>;
type SelectionChipVariant = NonNullable<ChipProps["variant"]>;
const SelectionIndicator = ({
	config,
	isDisabled,
	isSelected,
}: {
	config: SelectableCardConfig;
	isDisabled: boolean;
	isSelected: boolean;
}) => {
	const slotClassNames = selectableCardListClassNames({
		disabled: isDisabled,
		selected: isSelected,
	});
	const chipColor: SelectionChipColor = isSelected ? "accent" : "default";
	const chipVariant: SelectionChipVariant = isSelected ? "primary" : "soft";
	return (
		// 카드 전체가 선택 Pressable이므로 상태 chip이 터치를 가로채지 않도록 합니다.
		<Chip
			className={slotClassNames.indicator()}
			color={chipColor}
			disabled
			size="sm"
			variant={chipVariant}
		>
			<PureRadio.Indicator className={slotClassNames.radioIndicator()} />
			<Text
				className={chipClassNames.label({
					className: "font-bold",
					color: chipColor,
					size: "sm",
					variant: chipVariant,
				})}
			>
				{isSelected
					? (config.selectedLabel ?? "Selected")
					: (config.selectLabel ?? "Select")}
			</Text>
		</Chip>
	);
};
const SelectableCard = ({
	config,
	item,
}: {
	config: SelectableCardConfig;
	item: SelectableCardItem;
}) => {
	const isSelected = config.selectedValue === item.value;
	const isDisabled = Boolean(config.disabled || item.isDisabled);
	const slotClassNames = selectableCardListClassNames({
		disabled: isDisabled,
		selected: isSelected,
	});
	return (
		<PureRadio
			accessibilityLabel={toAccessibleText(item.title)}
			accessibilityState={{
				checked: isSelected,
				disabled: isDisabled,
				selected: isSelected,
			}}
			isDisabled={isDisabled}
			isSelected={isSelected}
			className={slotClassNames.card()}
			onPress={createSelectHandler(item, config)}
			style={[config.cardStyle, isSelected ? config.selectedCardStyle : null]}
			variant="secondary"
		>
			<VStack gap="block">
				<HStack
					alignItems="start"
					gap="inline"
					justifyContent="between"
					key="header"
				>
					<HStack alignItems="start" className="flex-1" gap="inline" key="title">
						<SelectableTitleIcon item={item} />
						<VStack className="flex-1" gap="dense">
							<NodeText
								className={slotClassNames.eyebrow()}
								node={item.eyebrow}
							/>
							<NodeText
								className={slotClassNames.cardTitle()}
								node={item.title}
							/>
						</VStack>
					</HStack>
					<SelectionIndicator
						config={config}
						isDisabled={isDisabled}
						isSelected={isSelected}
					/>
				</HStack>
				<NodeText
					className={slotClassNames.cardDescription()}
					node={item.description}
				/>
				<SelectableMetaList item={item} />
				<SelectableTags item={item} />
				<DisabledReasonText item={item} />
			</VStack>
		</PureRadio>
	);
};
const SelectableCards = ({
	config,
	items,
}: {
	config: SelectableCardConfig;
	items: readonly SelectableCardItem[];
}) => (
	<>
		{items.map((item) => (
			<SelectableCard config={config} item={item} key={item.value} />
		))}
	</>
);
const EmptyContent = ({
	emptyContent,
	emptyLabel,
}: {
	emptyContent?: ReactNode;
	emptyLabel?: ReactNode;
}) => {
	if (emptyContent) {
		return emptyContent;
	}
	return (
		<View accessibilityRole="summary" className={classNames.empty()}>
			<Text className={classNames.emptyTitle()}>
				{emptyLabel ?? "No options available"}
			</Text>
		</View>
	);
};
const PureSelectableCardListComponent = (
	props: PureSelectableCardListProps,
) => {
	const {
		cardStyle,
		description,
		disabled = false,
		emptyContent,
		emptyLabel,
		items = [],
		onSelect,
		selectLabel,
		selectedCardStyle,
		selectedLabel,
		selectedValue,
		style,
		title,
		...rest
	} = props;
	const config: SelectableCardConfig = {
		cardStyle,
		disabled,
		onSelect,
		selectLabel,
		selectedCardStyle,
		selectedLabel,
		selectedValue,
	};

	return (
		<VStack {...rest} gap="block" style={style}>
			{title || description ? (
				<VStack gap="dense">
					<NodeText className={classNames.title()} node={title} />
					<NodeText className={classNames.description()} node={description} />
				</VStack>
			) : null}
			{items.length > 0 ? (
				<VStack gap="block">
					<SelectableCards config={config} items={items} />
				</VStack>
			) : (
				<EmptyContent emptyContent={emptyContent} emptyLabel={emptyLabel} />
			)}
		</VStack>
	);
};
PureSelectableCardListComponent.displayName = "PureSelectableCardList";
export const PureSelectableCardList = PureSelectableCardListComponent;
export const SelectableCardList = PureSelectableCardList;
export type SelectableCardListProps = PureSelectableCardListProps;
const selectableCardListClassNames = tv({
	slots: {
		card: "flex-col items-stretch justify-start rounded-lg border border-border bg-surface p-4",
		cardDescription: "text-[13px] leading-5 text-muted",
		cardTitle: "text-base font-bold leading-[22px] text-foreground",
		description: "text-[13px] leading-5 text-muted",
		disabledReason: "text-[13px] leading-[18px] text-warning",
		empty: "rounded-lg border border-border bg-surface-secondary p-4",
		emptyTitle: "text-sm leading-5 text-muted",
		eyebrow: "text-xs font-bold uppercase leading-4 text-accent",
		indicator: "",
		metaText: "text-[13px] leading-[18px] text-surface-foreground",
		radioIndicator: "size-4",
		tag: "rounded-full border border-border bg-surface-secondary px-2 py-1",
		tagText:
			"text-xs font-semibold leading-4 text-surface-secondary-foreground",
		title: "text-base font-extrabold leading-6 text-foreground",
		titleIcon:
			"mt-0.5 h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-secondary",
	},
	variants: {
		disabled: {
			false: {},
			true: {
				card: "opacity-60",
				indicator: "bg-surface-tertiary",
			},
		},
		selected: {
			false: {},
			true: {
				card: "border-accent bg-accent-soft",
			},
		},
	},
	defaultVariants: {
		disabled: false,
		selected: false,
	},
});
const classNames = selectableCardListClassNames();
