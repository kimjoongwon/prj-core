import type { Meta, StoryObj } from "@storybook/react";
import { PageStoryStage } from "../storybookFrame";
import { AuthErrorScreen } from "./AuthErrorScreen";

const centeredCardStyle = {
	width: "100%",
	maxWidth: 460,
};

const meta = {
	component: AuthErrorScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof AuthErrorScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

const renderAuthErrorScreen: Story["render"] = (args) => (
	<PageStoryStage>
		<div style={centeredCardStyle}>
			<AuthErrorScreen {...args} />
		</div>
	</PageStoryStage>
);

export const Default: Story = {
	args: {
		error: "OIDC 클라이언트를 찾을 수 없습니다",
		errorDescription:
			"요청한 clientId가 비활성화되었거나 잘못된 값으로 전달되었습니다.",
		onClickBack: () => undefined,
	},
	render: renderAuthErrorScreen,
};

export const WithoutDescription: Story = {
	args: {
		error: "인증 요청을 처리할 수 없습니다",
		errorDescription: "",
		onClickBack: () => undefined,
	},
	render: renderAuthErrorScreen,
};
