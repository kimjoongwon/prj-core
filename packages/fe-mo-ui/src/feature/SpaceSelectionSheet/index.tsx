import { observer } from "mobx-react-lite";
import { ScrollView, View } from "react-native";
import { tv } from "tailwind-variants";
import { Text } from "../../data-display/Text";
import { BottomSheet } from "../../layout/BottomSheet";
import {
	SpaceSelectionList,
	type SpaceSelectionListProps,
} from "../../widget/SpaceSelectionList";

export interface SpaceSelectionSheetProps
	extends Pick<
		SpaceSelectionListProps,
		"disabled" | "onSelectSpace" | "selectedSpaceId" | "spaces"
	> {
	description?: string;
	isOpen: boolean;
	onOpenChange?: (isOpen: boolean) => void;
	title?: string;
}

export const SpaceSelectionSheet = observer(function SpaceSelectionSheet({
	description = "예약에 사용할 지점을 선택해 주세요.",
	disabled = false,
	isOpen,
	onOpenChange,
	onSelectSpace,
	selectedSpaceId,
	spaces = [],
	title = "지점 변경",
}: SpaceSelectionSheetProps) {
	return (
		<BottomSheet isOpen={isOpen} onOpenChange={onOpenChange}>
			<BottomSheet.Portal>
				<BottomSheet.Overlay className={classNames.overlay()} />
				<BottomSheet.Content
					className={classNames.content()}
					snapPoints={["72%"]}
				>
					<View className={classNames.header()}>
						<View className={classNames.titleBlock()}>
							<BottomSheet.Title className={classNames.title()}>
								{title}
							</BottomSheet.Title>
							<BottomSheet.Description className={classNames.description()}>
								{description}
							</BottomSheet.Description>
						</View>
						<BottomSheet.Close accessibilityLabel="지점 변경 닫기" />
					</View>
					<ScrollView
						className={classNames.scroll()}
						contentContainerClassName={classNames.scrollContent()}
						showsVerticalScrollIndicator={false}
					>
						{spaces.length > 0 ? (
							<SpaceSelectionList
								disabled={disabled}
								onSelectSpace={onSelectSpace}
								selectedSpaceId={selectedSpaceId}
								spaces={spaces}
							/>
						) : (
							<View className={classNames.empty()}>
								<Text className={classNames.emptyText()}>
									선택할 수 있는 지점이 없습니다.
								</Text>
							</View>
						)}
					</ScrollView>
				</BottomSheet.Content>
			</BottomSheet.Portal>
		</BottomSheet>
	);
});

SpaceSelectionSheet.displayName = "SpaceSelectionSheet";

const spaceSelectionSheetClassNames = tv({
	slots: {
		content: "gap-4 rounded-t-2xl bg-background px-4 pb-6 pt-4",
		description: "text-[13px] font-medium leading-5 text-muted",
		empty:
			"min-h-24 items-center justify-center rounded-lg border border-border bg-surface px-4 py-6",
		emptyText: "text-center text-sm font-semibold leading-5 text-muted",
		header: "flex-row items-start justify-between gap-3",
		overlay: "bg-foreground/20",
		scroll: "max-h-full",
		scrollContent: "gap-2 pb-4",
		title: "text-lg font-bold leading-6 text-foreground",
		titleBlock: "min-w-0 flex-1 gap-1",
	},
});

const classNames = spaceSelectionSheetClassNames();
