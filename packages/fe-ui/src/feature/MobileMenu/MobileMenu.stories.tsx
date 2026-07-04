import type { Meta, StoryObj } from "@storybook/react";
import { PageStoryScaffold } from "../../screen/storybookFrame";
import { MobileMenu } from "./MobileMenu";

const meta = {
	title: "feature/MobileMenu",
	component: MobileMenu,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
} satisfies Meta<typeof MobileMenu>;
export default meta;
type Story = StoryObj<typeof meta>;
export const StoreBound: Story = {
	render: () => (
		<PageStoryScaffold
			componentName="MobileMenu"
			componentPath="feature/MobileMenu"
			description="layout submenu store에 직접 연결되는 feature입니다. 독립 UI는 widget/OverlayMenu story에서 확인합니다."
		/>
	),
};
