import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import {
	type ImageSourcePropType,
	Pressable,
	type PressableProps,
	View,
} from "react-native";
import { tv } from "tailwind-variants";
import { Avatar } from "../../data-display/Avatar";
import { Text } from "../../data-display/Text";
import { Icon } from "../../icon";
import { Card } from "../../layout/Card";

export interface SpaceListItemInfo {
	id: string;
	name: string;
	address?: string | null;
	imageSource?: ImageSourcePropType;
}

export interface SpaceListItemProps
	extends Omit<PressableProps, "children" | "onPress"> {
	accessory?: ReactNode;
	isSelected?: boolean;
	onPressSpace?: (space: SpaceListItemInfo) => void;
	space: SpaceListItemInfo;
}

export const SpaceListItem = observer(function SpaceListItem({
	accessory,
	disabled = false,
	isSelected = false,
	onPressSpace,
	space,
	...rest
}: SpaceListItemProps) {
	const isDisabled = Boolean(disabled);
	const isActive = Boolean(isSelected);
	const slotClassNames = spaceListItemClassNames({
		disabled: isDisabled,
		selected: isActive,
	});

	const onPressItem = () => {
		if (isDisabled) {
			return;
		}

		onPressSpace?.(space);
	};

	return (
		<Pressable
			{...rest}
			accessibilityLabel={rest.accessibilityLabel ?? `지점 선택 ${space.name}`}
			accessibilityRole="button"
			accessibilityState={{ disabled: isDisabled, selected: isActive }}
			className={slotClassNames.pressable()}
			disabled={isDisabled}
			onPress={onPressItem}
		>
			<Card className={slotClassNames.root()}>
				<View className={slotClassNames.thumbnail()}>
					<Avatar
						alt={`${space.name} 지점 이미지`}
						color="accent"
						size="lg"
						variant="soft"
					>
						{space.imageSource ? (
							<Avatar.Image
								className={slotClassNames.avatarImage()}
								source={space.imageSource}
							/>
						) : null}
						<Avatar.Fallback className={slotClassNames.avatarFallback()}>
							<Icon name="mapPin" size="md" tone="accent" />
						</Avatar.Fallback>
					</Avatar>
				</View>
				<View className={slotClassNames.content()}>
					<Text className={slotClassNames.name()} numberOfLines={1}>
						{space.name}
					</Text>
					<Text className={slotClassNames.address()} numberOfLines={2}>
						{space.address || "주소 정보가 없습니다."}
					</Text>
				</View>
				<View className={slotClassNames.accessory()}>
					{accessory ??
						(isActive ? (
							<Icon name="circleCheck" size="md" tone="accent" />
						) : null)}
				</View>
			</Card>
		</Pressable>
	);
});

SpaceListItem.displayName = "SpaceListItem";

const spaceListItemClassNames = tv({
	slots: {
		accessory: "w-7 items-end justify-center",
		address: "text-[12px] font-medium leading-4 text-muted",
		avatarFallback: "items-center justify-center",
		avatarImage: "h-full w-full",
		content: "min-w-0 flex-1 gap-1",
		name: "text-[15px] font-bold leading-5 text-foreground",
		pressable: "rounded-lg",
		root: "min-h-[84px] flex-row items-center gap-3 rounded-lg border border-border bg-surface px-3 py-3",
		thumbnail:
			"h-14 w-14 items-center justify-center overflow-hidden rounded-lg bg-accent-soft",
	},
	variants: {
		disabled: {
			true: {
				root: "opacity-50",
			},
		},
		selected: {
			true: {
				root: "border-accent bg-accent-soft",
			},
		},
	},
});
