import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tv } from "tailwind-variants";

export interface CustomHeaderProps {
	title?: ReactNode;
	subtitle?: ReactNode;
	canGoBack?: boolean;
	onPressBack?: () => void;
	right?: ReactNode;
}

export const CustomHeader = observer(function CustomHeader({
	title,
	subtitle,
	canGoBack = false,
	onPressBack,
	right,
}: CustomHeaderProps) {
	const insets = useSafeAreaInsets();
	const shouldShowBack = canGoBack && Boolean(onPressBack);

	return (
		<View
			className={classNames.root()}
			style={{ paddingTop: insets.top }}
		>
			<View className={classNames.bar()}>
				<View className={classNames.side()}>
					{shouldShowBack ? (
						<Pressable
							accessibilityLabel="뒤로 가기"
							accessibilityRole="button"
							className={classNames.backButton()}
							onPress={onPressBack}
						>
							<Text className={classNames.backIcon()}>‹</Text>
						</Pressable>
					) : null}
				</View>
				<View className={classNames.titleBlock()}>
					<Text className={classNames.title()} numberOfLines={1}>
						{title}
					</Text>
					{subtitle ? (
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
			"h-10 w-10 items-center justify-center rounded-full bg-surface-secondary",
		backIcon: "text-[30px] font-bold leading-9 text-foreground",
		bar: "min-h-14 flex-row items-center gap-3 px-5 pb-3",
		root: "border-b border-border bg-background",
		side: "w-12 items-start justify-center",
		subtitle: "text-xs font-medium leading-4 text-muted",
		title: "text-lg font-extrabold leading-6 text-foreground",
		titleBlock: "flex-1 items-center justify-center",
	},
});

const classNames = customHeaderClassNames();
