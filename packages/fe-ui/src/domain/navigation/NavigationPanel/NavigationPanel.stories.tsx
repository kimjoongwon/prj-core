import type { Meta, StoryObj } from "@storybook/react";
import { PageStoryScaffold } from "../../../screen/storybookFrame";
import { NavigationPanel } from "./NavigationPanel";

const meta = {
	title: "domain/navigation/NavigationPanel",
	component: NavigationPanel,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
} satisfies Meta<typeof NavigationPanel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Connected: Story = {
	render: () => (
		<PageStoryScaffold
			componentName="NavigationPanel"
			componentPath="domain/navigation/NavigationPanel"
			description="Navigation store와 ability copy에 연결되는 domain navigation panel입니다."
		/>
	),
};
