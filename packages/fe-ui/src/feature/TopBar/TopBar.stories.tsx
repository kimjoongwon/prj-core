import type { Meta, StoryObj } from "@storybook/react";
import { PageStoryScaffold } from "../../screen/storybookFrame";
import { TopBar } from "./TopBar";

const meta = {
	title: "feature/TopBar",
	component: TopBar,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
} satisfies Meta<typeof TopBar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const StoreBound: Story = {
	render: () => (
		<PageStoryScaffold
			componentName="TopBar"
			componentPath="feature/TopBar"
			description="router, root store, current space mutation에 직접 연결되는 feature입니다. 독립 UI는 widget/HeaderBar와 feature/HeaderSpaceSelector story에서 확인합니다."
		/>
	),
};
