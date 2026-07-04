import type { Meta, StoryObj } from "@storybook/react";
import { PageStoryScaffold } from "../../screen/storybookFrame";
import { SideNavigation } from "./SideNavigation";

const meta = {
	title: "feature/SideNavigation",
	component: SideNavigation,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
} satisfies Meta<typeof SideNavigation>;
export default meta;
type Story = StoryObj<typeof meta>;
export const StoreBound: Story = {
	render: () => (
		<PageStoryScaffold
			componentName="SideNavigation"
			componentPath="feature/SideNavigation"
			description="navigation store와 ability copy에 직접 연결되는 feature입니다. 독립 UI는 widget/SidePanel story에서 확인합니다."
		/>
	),
};
