import type { Meta, StoryObj } from "@storybook/react";
import { buildOverviewManifest } from "../src/overview/manifest";
import { PageOverview } from "../src/overview/PageOverview";

const manifest = buildOverviewManifest();

const meta = {
	title: "overview/Page Overview",
	component: PageOverview,
	args: {
		manifest,
	},
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component:
					"Storybook-local workspace for page catalog coverage, React Flow screen relationships, and page-planning deep links across admin and idp apps.",
			},
		},
	},
	render: (args) => <PageOverview {...args} />,
	tags: ["autodocs"],
} satisfies Meta<typeof PageOverview>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
