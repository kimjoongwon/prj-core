import type { Meta, StoryObj } from "@storybook/react";
import { PageStoryScaffold } from "../../screen/storybookFrame";
import { AccessGate } from "./AccessGate";

const meta = {
	title: "feature/AccessGate",
	component: AccessGate,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
} satisfies Meta<typeof AccessGate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StoreBound: Story = {
	args: { contents: <div /> },
	render: () => (
		<PageStoryScaffold
			componentName="AccessGate"
			componentPath="feature/AccessGate"
			description="router, auth store, ability store, token verification에 직접 연결되는 gate라 Storybook에서는 계약 등록용 scaffold로 표시합니다."
		/>
	),
};
