import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "./Text";

const meta = {
	title: "Ui/data-display/Text",
	component: Text,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A versatile text component that provides semantic HTML elements with consistent styling.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: [
				"h1",
				"h2",
				"h3",
				"h4",
				"h5",
				"h6",
				"title",
				"subtitle1",
				"subtitle2",
				"body1",
				"body2",
				"caption",
				"label",
				"text",
				"error",
			],
		},
		truncate: {
			control: "boolean",
		},
		lineClamp: {
			control: "select",
			options: [1, 2, 3, 4, 5, 6, "none"],
		},
		as: {
			control: "select",
			options: ["p", "div", "span", "h1", "h2", "h3", "h4", "h5", "h6"],
		},
		children: {
			control: "text",
		},
	},
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "This is default body text",
	},
};

export const Variants: Story = {
	render: () => (
		<div className="max-w-2xl space-y-2">
			<Text variant="h1">H1: The quick brown fox</Text>
			<Text variant="h2">H2: The quick brown fox</Text>
			<Text variant="h3">H3: The quick brown fox</Text>
			<Text variant="h4">H4: The quick brown fox</Text>
			<Text variant="h5">H5: The quick brown fox</Text>
			<Text variant="h6">H6: The quick brown fox</Text>
			<Text variant="title">Title: The quick brown fox</Text>
			<Text variant="subtitle1">Subtitle 1: The quick brown fox</Text>
			<Text variant="subtitle2">Subtitle 2: The quick brown fox</Text>
			<Text variant="body1">
				Body 1: The quick brown fox jumps over the lazy dog
			</Text>
			<Text variant="body2">
				Body 2: The quick brown fox jumps over the lazy dog
			</Text>
			<Text variant="caption">Caption: The quick brown fox</Text>
			<Text variant="label">Label: The quick brown fox</Text>
			<Text variant="text">Text: The quick brown fox</Text>
			<Text variant="error">Error: Something went wrong</Text>
		</div>
	),
};

export const States: Story = {
	render: () => (
		<div className="w-48 space-y-4">
			<Text truncate>
				This is a very long text that will be truncated with ellipsis when it
				overflows the container width
			</Text>
			<Text lineClamp={2}>
				This is a multi-line text that will be clamped to exactly two lines when
				it exceeds the specified line limit, showing ellipsis at the end of the
				second line
			</Text>
		</div>
	),
};

export const Composition: Story = {
	render: () => (
		<div className="space-y-4">
			<Text as="div" variant="h2">
				H2 styling as div element
			</Text>
			<Text as="span" variant="label">
				Label styling as span element
			</Text>
			<Text as="p" variant="caption">
				Caption styling as paragraph element
			</Text>
		</div>
	),
};

export const Playground: Story = {
	args: {
		children: "Playground Text",
		variant: "body1",
		truncate: false,
		lineClamp: "none",
	},
};
