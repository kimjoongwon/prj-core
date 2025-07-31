import type { Meta, StoryObj } from "@storybook/react";
import { VideoUploader } from "./VideoUploader";

const meta: Meta<typeof VideoUploader> = {
	title: "Inputs/VideoUploader",
	component: VideoUploader,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: "Upload a video",
	},
};
