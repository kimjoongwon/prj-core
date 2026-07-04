import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { DraggableSortableList, DragHandle } from "./DraggableSortableList";

interface StoryItem {
	id: string;
	label: string;
	description: string;
}

const initialItems: StoryItem[] = [
	{
		id: "intro",
		label: "기본 정보",
		description: "고객에게 먼저 보이는 항목입니다.",
	},
	{
		id: "schedule",
		label: "운영 시간",
		description: "예약 가능 시간을 안내합니다.",
	},
	{
		id: "policy",
		label: "취소 정책",
		description: "환불과 변경 기준을 설명합니다.",
	},
];

const meta = {
	title: "data-display/DraggableSortableList",
	component: DraggableSortableList,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof DraggableSortableList>;

export default meta;
type Story = StoryObj<typeof meta>;

const storyArgs = {
	items: initialItems,
	disabled: false,
	onReorder: (_fromIndex: number, _toIndex: number) => undefined,
	renderItem: (item: { id: string }) => (
		<span>
			{initialItems.find((initialItem) => initialItem.id === item.id)?.label ??
				item.id}
		</span>
	),
};

function SortableFixture({ disabled = false }: { disabled?: boolean }) {
	const [items, setItems] = useState(initialItems);

	return (
		<div className="w-[420px] max-w-[calc(100vw-32px)]">
			<DraggableSortableList
				items={items}
				disabled={disabled}
				onReorder={(fromIndex, toIndex) => {
					setItems((currentItems) => {
						const nextItems = [...currentItems];
						const [movedItem] = nextItems.splice(fromIndex, 1);
						nextItems.splice(toIndex, 0, movedItem);
						return nextItems;
					});
				}}
				renderItem={(item, index, dragHandleProps) => (
					<div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-3 shadow-sm">
						<DragHandle {...dragHandleProps} disabled={disabled} />
						<div className="min-w-0 flex-1">
							<p className="text-sm font-semibold text-foreground">
								{index + 1}. {item.label}
							</p>
							<p className="truncate text-xs text-muted">{item.description}</p>
						</div>
					</div>
				)}
			/>
		</div>
	);
}

export const Default: Story = {
	args: storyArgs,
	render: () => <SortableFixture />,
};

export const Disabled: Story = {
	args: { ...storyArgs, disabled: true },
	render: () => <SortableFixture disabled />,
};
