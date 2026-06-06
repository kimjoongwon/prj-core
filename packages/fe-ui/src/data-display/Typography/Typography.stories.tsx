import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from "./Typography";

const meta = {
	title: "Ui/data-display/Typography",
	component: Typography,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"HeroUI Typography wrapped by fe-ui. It keeps i18n child translation and exposes Root, Heading, Paragraph, Code, and Prose parts.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		type: {
			control: "select",
			options: [
				"body",
				"body-sm",
				"body-xs",
				"code",
				"h1",
				"h2",
				"h3",
				"h4",
				"h5",
				"h6",
			],
		},
		color: {
			control: "select",
			options: ["default", "muted"],
		},
		weight: {
			control: "select",
			options: ["normal", "medium", "semibold", "bold"],
		},
		truncate: {
			control: "boolean",
		},
		children: {
			control: "text",
		},
	},
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "This is HeroUI Typography wrapped by @cocrepo/ui.",
		type: "body",
	},
};

export const Headings: Story = {
	render: () => (
		<div className="space-y-4">
			<Typography.Heading level={1}>Heading 1</Typography.Heading>
			<Typography.Heading level={2}>Heading 2</Typography.Heading>
			<Typography.Heading level={3}>Heading 3</Typography.Heading>
			<Typography.Heading level={4}>Heading 4</Typography.Heading>
			<Typography.Heading level={5}>Heading 5</Typography.Heading>
			<Typography.Heading level={6}>Heading 6</Typography.Heading>
		</div>
	),
};

export const Paragraphs: Story = {
	render: () => (
		<div className="max-w-md space-y-4">
			<Typography.Paragraph>
				Base paragraph text for ordinary body copy.
			</Typography.Paragraph>
			<Typography.Paragraph size="sm" color="muted">
				Small muted paragraph for descriptions and secondary content.
			</Typography.Paragraph>
			<Typography.Paragraph size="xs" color="muted">
				Extra small muted paragraph for captions and dense metadata.
			</Typography.Paragraph>
		</div>
	),
};

export const RootVariants: Story = {
	render: () => (
		<div className="max-w-md space-y-4">
			<Typography type="h4" weight="normal">
				Root can render official HeroUI type tokens.
			</Typography>
			<Typography type="body-sm" weight="semibold">
				Semibold body-sm works well for labels.
			</Typography>
			<Typography type="body-sm" className="text-danger font-medium">
				Error text uses official type with local state color.
			</Typography>
		</div>
	),
};

export const CodeAndProse: Story = {
	render: () => (
		<div className="max-w-xl space-y-4">
			<Typography.Code>pnpm --filter=@cocrepo/ui test</Typography.Code>
			<Typography.Prose>
				<h2 key="heading">Prose content</h2>
				<p key="copy">
					Prose wraps longer article-like content while the other parts keep
					compact UI text predictable.
				</p>
			</Typography.Prose>
		</div>
	),
};

export const Truncate: Story = {
	render: () => (
		<div className="w-64 space-y-4">
			<Typography truncate>
				This single-line text is intentionally long and will truncate when the
				container is too narrow.
			</Typography>
			<Typography.Paragraph className="line-clamp-2">
				Multi-line clamping is handled by Tailwind line-clamp utilities on the
				official part className instead of a legacy lineClamp prop.
			</Typography.Paragraph>
		</div>
	),
};
