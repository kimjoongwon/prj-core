import type { ReactNode } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tv } from "tailwind-variants";
import { Typography } from "../../data-display/Typography";
import { Icon } from "../../icon";
import { HStack } from "../../rhythm";

export interface CustomHeaderProps {
	title?: ReactNode;
	subtitle?: ReactNode;
	canGoBack?: boolean;
	onPressBack?: () => void;
	onPressSubtitle?: () => void;
	right?: ReactNode;
	subtitleAccessibilityLabel?: string;
}

// 자막 버튼은 시각 크기를 유지하면서 44px 터치 영역을 hit slop으로 확보합니다.
const SUBTITLE_BUTTON_HIT_SLOP = 14;

export function CustomHeader({
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
			<HStack alignItems="center" className={classNames.bar()} gap="inline">
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
					<Typography className={classNames.title()} numberOfLines={1} type="body-sm">
						{title}
					</Typography>
					{shouldUseSubtitleButton ? (
						<Pressable
							accessibilityLabel={
								subtitleAccessibilityLabel ?? "현재 지점 변경"
							}
							accessibilityRole="button"
							className={classNames.subtitleButton()}
							hitSlop={SUBTITLE_BUTTON_HIT_SLOP}
							onPress={onPressSubtitle}
						>
							<Typography
								className={classNames.subtitle()}
								numberOfLines={1}
								type="body-sm"
							>
								{subtitle}
							</Typography>
						</Pressable>
					) : subtitle ? (
						<Typography
							className={classNames.subtitle()}
							numberOfLines={1}
							type="body-sm"
						>
							{subtitle}
						</Typography>
					) : null}
				</View>
				<View className={classNames.side()}>{right}</View>
			</HStack>
		</View>
	);
}

CustomHeader.displayName = "CustomHeader";

const customHeaderClassNames = tv({
	slots: {
		// 44px 최소 터치 타겟(Touch Target 계약)을 min 치수로 보장합니다.
		backButton:
			"min-h-11 min-w-11 items-center justify-center rounded-lg border border-border bg-surface-secondary",
		bar: "min-h-12 px-4 pb-2",
		root: "border-b border-border bg-surface dark:bg-surface-tertiary",
		side: "min-w-11 items-start justify-center",
		subtitle: "text-[11px] font-semibold leading-4 text-muted",
		subtitleButton: "max-w-full rounded-md px-1",
		title: "text-base font-extrabold leading-6 text-foreground",
		titleBlock: "flex-1 items-center justify-center",
	},
});

const classNames = customHeaderClassNames();
