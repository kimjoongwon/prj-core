import { observer } from "mobx-react-lite";
import { View, type ViewProps } from "react-native";
import { tv } from "tailwind-variants";
import { Typography } from "../../data-display/Typography";
import { SpaceListItem, type SpaceListItemInfo } from "../SpaceListItem";

export interface SpaceSelectionListProps extends Omit<ViewProps, "children"> {
	disabled?: boolean;
	emptyLabel?: string;
	onSelectSpace?: (space: SpaceListItemInfo) => void;
	selectedSpaceId?: string | null;
	spaces?: readonly SpaceListItemInfo[];
}

export const SpaceSelectionList = observer(function SpaceSelectionList({
	disabled = false,
	emptyLabel = "선택할 수 있는 지점이 없습니다.",
	onSelectSpace,
	selectedSpaceId,
	spaces = [],
	...rest
}: SpaceSelectionListProps) {
	if (spaces.length === 0) {
		return (
			<View {...rest} className={classNames.empty()}>
				<Typography className={classNames.emptyText()} type="body-sm">
					{emptyLabel}
				</Typography>
			</View>
		);
	}

	return (
		<View {...rest} className={classNames.root()}>
			{spaces.map((space) => (
				<SpaceListItem
					disabled={disabled}
					isSelected={space.id === selectedSpaceId}
					key={space.id}
					onPressSpace={onSelectSpace}
					space={space}
				/>
			))}
		</View>
	);
});

SpaceSelectionList.displayName = "SpaceSelectionList";

const spaceSelectionListClassNames = tv({
	slots: {
		empty:
			"min-h-24 items-center justify-center rounded-lg border border-border bg-surface px-4 py-6",
		emptyText: "text-center text-sm font-semibold leading-5 text-muted",
		root: "gap-2",
	},
});

const classNames = spaceSelectionListClassNames();
