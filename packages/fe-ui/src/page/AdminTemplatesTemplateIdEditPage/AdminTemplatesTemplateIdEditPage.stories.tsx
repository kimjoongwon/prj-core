import type { Meta, StoryObj } from "@storybook/react";
import { PageStoryScaffold } from "../storybookFrame";

const meta = {
	component: PageStoryScaffold,
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component:
					"Generated baseline page story for AdminTemplatesTemplateIdEditPage. Replace this scaffold with scenario-focused stories when page fixtures are available.",
			},
		},
	},
	tags: ["autodocs"],
	args: {
		componentName: "AdminTemplatesTemplateIdEditPage",
		componentPath:
			"page/AdminTemplatesTemplateIdEditPage/AdminTemplatesTemplateIdEditPage.tsx",
	},
} satisfies Meta<typeof PageStoryScaffold>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
