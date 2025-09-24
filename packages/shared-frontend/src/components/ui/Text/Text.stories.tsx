import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "./Text";

const meta = {
	title: "UI/Text",
	component: Text,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A versatile text component that provides semantic HTML elements with consistent styling. Supports dark mode and provides appropriate text colors for different contexts.",
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
			description: "The typography variant to apply",
			defaultValue: "body1",
		},
		truncate: {
			control: "boolean",
			description: "Whether to truncate the text with ellipsis",
			defaultValue: false,
		},
		lineClamp: {
			control: "select",
			options: [1, 2, 3, 4, 5, 6, "none"],
			description: "Number of lines to clamp the text to",
			defaultValue: "none",
		},
		as: {
			control: "select",
			options: ["p", "div", "span", "h1", "h2", "h3", "h4", "h5", "h6"],
			description: "Custom HTML element to render as",
		},
		children: {
			control: "text",
			description: "The text content to display",
		},
	},
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "This is default body text",
	},
	parameters: {
		docs: {
			description: {
				story: "Default text with body1 variant.",
			},
		},
	},
};

export const Headings: Story = {
	render: () => (
		<div className="space-y-4">
			<Text variant="h1">Heading 1</Text>
			<Text variant="h2">Heading 2</Text>
			<Text variant="h3">Heading 3</Text>
			<Text variant="h4">Heading 4</Text>
			<Text variant="h5">Heading 5</Text>
			<Text variant="h6">Heading 6</Text>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "All heading variants from h1 to h6.",
			},
		},
	},
};

export const BodyText: Story = {
	render: () => (
		<div className="max-w-md space-y-4">
			<Text variant="title">Title Text</Text>
			<Text variant="subtitle1">Subtitle 1 - Lorem ipsum dolor sit amet</Text>
			<Text variant="subtitle2">Subtitle 2 - Consectetur adipiscing elit</Text>
			<Text variant="body1">
				Body 1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
				eiusmod tempor incididunt ut labore et dolore magna aliqua.
			</Text>
			<Text variant="body2">
				Body 2 - Ut enim ad minim veniam, quis nostrud exercitation ullamco
				laboris nisi ut aliquip ex ea commodo consequat.
			</Text>
			<Text variant="caption">Caption - Small descriptive text</Text>
			<Text variant="label">Label Text</Text>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Different body text variants and their usage.",
			},
		},
	},
};

export const ErrorText: Story = {
	args: {
		variant: "error",
		children: "This is an error message",
	},
	parameters: {
		docs: {
			description: {
				story: "Error variant for displaying error messages.",
			},
		},
	},
};

export const TruncatedText: Story = {
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
			<Text lineClamp={3}>
				This text demonstrates the line clamp feature which is useful for
				creating consistent layouts with preview text. It will show exactly
				three lines before cutting off with ellipsis, regardless of the actual
				content length.
			</Text>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Text truncation and line clamping examples.",
			},
		},
	},
};

export const CustomElements: Story = {
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
	parameters: {
		docs: {
			description: {
				story: "Using custom HTML elements with the 'as' prop.",
			},
		},
	},
};

export const AllVariants: Story = {
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
	parameters: {
		docs: {
			description: {
				story: "All available text variants in one view.",
			},
		},
	},
};

export const Playground: Story = {
	args: {
		children: "Playground Text",
		variant: "body1",
		truncate: false,
		lineClamp: "none",
	},
	parameters: {
		docs: {
			description: {
				story: "Playground for testing different text configurations.",
			},
		},
	},
};
