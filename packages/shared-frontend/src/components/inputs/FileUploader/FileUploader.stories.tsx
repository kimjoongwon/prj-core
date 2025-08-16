import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FileUploader } from "./FileUploader";

const meta: Meta<typeof FileUploader> = {
	title: "Inputs/FileUploader",
	component: FileUploader,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: "Upload a file",
		type: "all",
	},
	render: (args) => {
		const [value, setValue] = useState(null);
		return <FileUploader {...args} value={value} onChange={setValue} />;
	},
};

export const FullWidth: Story = {
	args: {
		label: "Upload a file (Full Width)",
		type: "all",
		fullWidth: true,
	},
	render: (args) => {
		const [value, setValue] = useState(null);
		return <FileUploader {...args} value={value} onChange={setValue} />;
	},
};

export const WithImage: Story = {
	args: {
		label: "Upload an image",
		type: "image",
	},
	render: (args) => {
		const [value, setValue] = useState({
			name: "example.png",
			url: "https://via.placeholder.com/150",
			mimeType: "image/png",
			size: 12345,
		});
		return <FileUploader {...args} value={value} onChange={setValue} />;
	},
};
