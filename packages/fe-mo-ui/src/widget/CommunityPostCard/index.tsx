import { type ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { observer } from "mobx-react-lite";
import { tv } from "tailwind-variants";
import { Chip } from "../../data-display/Chip";
import { Text } from "../../data-display/Text";
import { Icon } from "../../icon";
import { HStack, VStack } from "../../rhythm";

export interface CommunityPostCardProps extends Omit<ViewProps, "children"> {
	authorName: ReactNode;
	createdAtLabel: ReactNode;
	isMine?: boolean;
	isPinned?: boolean;
	text: ReactNode;
	title?: ReactNode;
}

export const CommunityPostCard = observer((props: CommunityPostCardProps) => {
	const {
		authorName,
		createdAtLabel,
		isMine = false,
		isPinned = false,
		style,
		text,
		title,
		...viewProps
	} = props;

	return (
		<View
			{...viewProps}
			accessibilityRole="summary"
			className={classNames.root()}
			style={style}
		>
			<VStack gap="block">
				<HStack alignItems="center" justifyContent="between" gap="inline">
					<HStack alignItems="center" className="flex-1" gap="dense">
						<Icon name="users" size="xs" tone="accent" />
						<Text className={classNames.author()} numberOfLines={1}>
							{authorName}
						</Text>
						<Text className={classNames.dot()}>·</Text>
						<Text className={classNames.createdAt()} numberOfLines={1}>
							{createdAtLabel}
						</Text>
					</HStack>
					<HStack alignItems="center" gap="dense">
						{isPinned ? (
							<Chip color="warning" size="sm" variant="soft">
								공지
							</Chip>
						) : null}
						{isMine ? (
							<Chip color="accent" size="sm" variant="soft">
								내 글
							</Chip>
						) : null}
					</HStack>
				</HStack>
				{title ? (
					<Text className={classNames.title()} numberOfLines={2}>
						{title}
					</Text>
				) : null}
				<Text className={classNames.text()} numberOfLines={6}>
					{text}
				</Text>
			</VStack>
		</View>
	);
});

CommunityPostCard.displayName = "CommunityPostCard";

const communityPostCardClassNames = tv({
	slots: {
		author: "max-w-[128px] text-[13px] font-extrabold leading-5 text-foreground",
		createdAt: "text-xs leading-4 text-muted",
		dot: "text-xs leading-4 text-muted",
		root: "rounded-xl border border-border bg-surface p-4",
		text: "text-[13px] leading-5 text-surface-foreground",
		title: "text-base font-extrabold leading-6 text-foreground",
	},
});

const classNames = communityPostCardClassNames();
