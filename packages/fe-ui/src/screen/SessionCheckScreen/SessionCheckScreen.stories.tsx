import type { Meta, StoryObj } from "@storybook/react";
import { SessionCheckScreen } from "./SessionCheckScreen";

const meta = {
	component: SessionCheckScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof SessionCheckScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AdminBootstrap: Story = {
	args: {
		title: "관리자 세션 확인",
		description:
			"공간 권한과 운영 콘솔 접근 권한을 확인한 뒤 적절한 페이지로 이동합니다.",
		message: "관리자 권한과 최근 접속 공간을 확인하고 있습니다.",
	},
};

export const IdpBootstrap: Story = {
	args: {
		title: "계정 상태 확인",
		description: "OIDC 세션과 비밀번호 재설정 상태를 점검합니다.",
		message: "인증 상태를 확인한 뒤 필요한 화면으로 이동합니다.",
	},
};
