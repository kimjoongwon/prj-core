import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tv } from "tailwind-variants";
import { Text } from "../../data-display/Text";
import { Icon } from "../../icon";

export interface CustomHeaderProps {
	title?: ReactNode;
	subtitle?: ReactNode;
	canGoBack?: boolean;
	onPressBack?: () => void;
	onPressSubtitle?: () => void;
	right?: ReactNode;
	subtitleAccessibilityLabel?: string;
}

export const CustomHeader = observer(function CustomHeader({
	title,
	subtitle,
	canGoBack = false,
	onPressBack,
	onPressSubtitle,
	right,
	subtitleAccessibilityLabel,
}: CustomHeaderProps) {
	const insets = useSafeAreaInsets();
	const shouldShowBack = canGoBack && Boolean(onPressBack);
	const shouldUseSubtitleButton = Boolean(subtitle && onPressSubtitle);

	return (
		<View className={classNames.root()} style={{ paddingTop: insets.top }}>
			<View className={classNames.bar()}>
				<View className={classNames.side()}>
					{shouldShowBack ? (
						<Pressable
							accessibilityLabel="뒤로 가기"
							accessibilityRole="button"
							className={classNames.backButton()}
							onPress={onPressBack}
						>
							<Icon name="chevronLeft" size="md" tone="foreground" />
						</Pressable>
					) : null}
				</View>
				<View className={classNames.titleBlock()}>
					<Text className={classNames.title()} numberOfLines={1}>
						{title}
					</Text>
					{shouldUseSubtitleButton ? (
						<Pressable
							accessibilityLabel={
								subtitleAccessibilityLabel ?? "현재 지점 변경"
							}
							accessibilityRole="button"
							className={classNames.subtitleButton()}
							onPress={onPressSubtitle}
						>
							<Text className={classNames.subtitle()} numberOfLines={1}>
								{subtitle}
							</Text>
						</Pressable>
					) : subtitle ? (
						<Text className={classNames.subtitle()} numberOfLines={1}>
							{subtitle}
						</Text>
					) : null}
				</View>
				<View className={classNames.side()}>{right}</View>
			</View>
		</View>
	);
});

CustomHeader.displayName = "CustomHeader";

const customHeaderClassNames = tv({
	slots: {
		backButton:
			"h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-secondary",
		bar: "min-h-12 flex-row items-center gap-2 px-4 pb-2",
		root: "border-b border-border bg-surface dark:bg-surface-tertiary",
		side: "w-10 items-start justify-center",
		subtitle: "text-[11px] font-semibold leading-4 text-muted",
		subtitleButton: "max-w-full rounded-md px-1",
		title: "text-base font-extrabold leading-6 text-foreground",
		titleBlock: "flex-1 items-center justify-center",
	},
});

const classNames = customHeaderClassNames();
