import type { Meta, StoryObj } from "@storybook/react";
import { LinkCell } from "./LinkCell";

const meta: Meta<typeof LinkCell> = {
	title: "cell/LinkCell",
	component: LinkCell,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		value: {
			control: "text",
			description: "Link text to display",
		},
		href: {
			control: "text",
			description: "URL to link to",
		},
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		value: "Click here",
		href: "https://example.com",
	},
};

export const InternalLink: Story = {
	args: {
		value: "Internal page",
		href: "/internal-page",
	},
};

export const ExternalLink: Story = {
	args: {
		value: "External website",
		href: "https://google.com",
		rel: "noreferrer",
		target: "_blank",
	},
};
