import { closestCenter, DndContext } from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SortableMedia } from "./SortableMedia";

const meta: Meta<typeof SortableMedia> = {
	title: "ui/SortableMedia",
	component: SortableMedia,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const mediaItems = [
	{
		id: "1",
		url: "https://via.placeholder.com/150",
		mimeType: "image/png",
	},
	{
		id: "2",
		url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
		mimeType: "video/mp4",
	},
	{
		id: "3",
		url: "https://via.placeholder.com/150/ff0000",
		mimeType: "image/png",
	},
];

const Template: Story = {
	render: (_args) => {
		const [items, setItems] = useState(mediaItems);

		const handleDragEnd = (event: any) => {
			const { active, over } = event;
			if (active.id !== over.id) {
				setItems((items) => {
					const oldIndex = items.findIndex((item) => item.id === active.id);
					const newIndex = items.findIndex((item) => item.id === over.id);
					return arrayMove(items, oldIndex, newIndex);
				});
			}
		};

		return (
			<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
				<SortableContext items={items} strategy={verticalListSortingStrategy}>
					<div className="grid grid-cols-3 gap-4">
						{items.map((item) => (
							<SortableMedia
								key={item.id}
								media={item}
								onRemove={(id) =>
									setItems((items) => items.filter((item) => item.id !== id))
								}
							/>
						))}
					</div>
				</SortableContext>
			</DndContext>
		);
	},
};

export const Default: Story = {
	...Template,
	args: {},
};
