import type { Meta, StoryObj } from "@storybook/react";
import { VideoPlayer } from "./VideoPlayer";
import { Button } from "@heroui/react";
import { useState } from "react";

const meta: Meta<typeof VideoPlayer> = {
	title: "ui/VideoPlayer",
	component: VideoPlayer,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story = {
	render: (args) => {
		const [isOpen, setIsOpen] = useState(args.isOpen);

		return (
			<>
				<Button onPress={() => setIsOpen(true)}>Open Video Player</Button>
				<VideoPlayer
					{...args}
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
				/>
			</>
		);
	},
};

export const Default: Story = {
	...Template,
	args: {
		src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
		isOpen: false,
	},
};
