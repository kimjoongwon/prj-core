import type { Meta, StoryObj } from "@storybook/react";
import { MediaThumbnail } from "./MediaThumbnail";

const meta = {
	title: "widget/MediaThumbnail",
	component: MediaThumbnail,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		title: "스튜디오 이미지",
		imageUrl:
			"https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=640&q=80",
	},
} satisfies Meta<typeof MediaThumbnail>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Image: Story = {
	render: (args) => (
		<div className="w-64">
			<MediaThumbnail {...args} />
		</div>
	),
};
export const Empty: Story = {
	args: { imageUrl: null, videoUrl: null },
	render: Image.render,
};
