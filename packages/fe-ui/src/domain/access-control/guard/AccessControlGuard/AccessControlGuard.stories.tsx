import type { Meta, StoryObj } from "@storybook/react";
import { PageStoryScaffold } from "../../../../screen/storybookFrame";
import { AccessControlGuard } from "./AccessControlGuard";

const meta = {
	title: "domain/access-control/guard/AccessControlGuard",
	component: AccessControlGuard,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
} satisfies Meta<typeof AccessControlGuard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Connected: Story = {
	args: { contents: <div /> },
	render: () => (
		<PageStoryScaffold
			componentName="AccessControlGuard"
			componentPath="domain/access-control/guard/AccessControlGuard"
			description="router, account, access control, token verification에 직접 연결되는 domain guard라 Storybook에서는 계약 등록용 scaffold로 표시합니다."
		/>
	),
};
