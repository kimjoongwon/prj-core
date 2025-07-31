import type { Meta, StoryObj } from "@storybook/react";
import { useLocalObservable } from "mobx-react-lite";
import { FileUploader } from "./FileUploader";

const meta: Meta<typeof FileUploader> = {
	title: "Components/Inputs/FileUploader",
	component: FileUploader,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story = {
	render: (args) => {
		const state = useLocalObservable(() => ({
			file: null,
		}));

		return <FileUploader {...args} state={state} path="file" />;
	},
};

export const Default: Story = {
	...Template,
	args: {
		label: "Upload a file",
		type: "all",
	},
};

export const FullWidth: Story = {
	...Template,
	args: {
		label: "Upload a file (Full Width)",
		type: "all",
		fullWidth: true,
	},
};

export const WithImage: Story = {
	render: (args) => {
		const state = useLocalObservable(() => ({
			file: {
				name: "example.png",
				url: "https://via.placeholder.com/150",
				mimeType: "image/png",
				size: 12345,
			},
		}));

		return <FileUploader {...args} state={state} path="file" />;
	},
	args: {
		label: "Upload an image",
		type: "image",
	},
};
