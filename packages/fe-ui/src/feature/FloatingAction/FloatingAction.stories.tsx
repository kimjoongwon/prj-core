import type { Meta, StoryObj } from "@storybook/react";
import { PageStoryScaffold } from "../../screen/storybookFrame";
import { FloatingAction } from "./FloatingAction";

const meta = {
	title: "feature/FloatingAction",
	component: FloatingAction,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
} satisfies Meta<typeof FloatingAction>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Connected: Story = {
	render: () => (
		<PageStoryScaffold
			componentName="FloatingAction"
			componentPath="feature/FloatingAction"
			description="app.ui.footer.floatingAction에 직접 연결되는 feature입니다. 독립 UI는 widget/ActionFab story에서 확인합니다."
		/>
	),
};
