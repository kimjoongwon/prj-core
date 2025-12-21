import type { Meta, StoryObj } from "@storybook/react";
import { LinkCell } from "./LinkCell";

const meta: Meta<typeof LinkCell> = {
	title: "Cell/LinkCell",
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
		isExternal: {
			control: "boolean",
			description: "Whether the link is external",
		},
		color: {
			control: "select",
			options: [
				"foreground",
				"primary",
				"secondary",
				"success",
				"warning",
				"danger",
			],
			description: "Link color theme",
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
			description: "Link size",
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
		isExternal: false,
	},
};

export const ExternalLink: Story = {
	args: {
		value: "External website",
		href: "https://google.com",
		isExternal: true,
	},
};

export const PrimaryColor: Story = {
	args: {
		value: "Primary link",
		href: "https://example.com",
		color: "primary",
	},
};

export const SuccessColor: Story = {
	args: {
		value: "Success link",
		href: "https://example.com",
		color: "success",
	},
};

export const DangerColor: Story = {
	args: {
		value: "Danger link",
		href: "https://example.com",
		color: "danger",
	},
};

export const SmallSize: Story = {
	args: {
		value: "Small link",
		href: "https://example.com",
		size: "sm",
	},
};

export const LargeSize: Story = {
	args: {
		value: "Large link",
		href: "https://example.com",
		size: "lg",
	},
};
