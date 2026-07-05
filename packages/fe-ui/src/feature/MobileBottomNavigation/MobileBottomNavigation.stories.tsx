import type { Meta, StoryObj } from "@storybook/react";
import { PageStoryScaffold } from "../../screen/storybookFrame";
import { MobileBottomNavigation } from "./MobileBottomNavigation";

const meta = {
	title: "feature/MobileBottomNavigation",
	component: MobileBottomNavigation,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
} satisfies Meta<typeof MobileBottomNavigation>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Connected: Story = {
	render: () => (
		<PageStoryScaffold
			componentName="MobileBottomNavigation"
			componentPath="feature/MobileBottomNavigation"
			description="layout의 Navigation에 직접 연결되는 feature입니다. 독립 UI는 widget/BottomNav story에서 확인합니다."
		/>
	),
};
