import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../input/Button/Button";
import { AuthCard } from "./AuthCard";
import { AuthCardHeader } from "./AuthCardHeader";

const meta = {
	title: "widget/AuthCard",
	component: AuthCard,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: { children: null },
} satisfies Meta<typeof AuthCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className="w-[420px]">
			<AuthCard>
				<AuthCardHeader
					title="로그인"
					subtitle="운영 콘솔에 접속합니다."
					iconPath="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
				/>
				<Button color="primary" className="w-full">
					계속
				</Button>
			</AuthCard>
		</div>
	),
};

export const Danger: Story = {
	render: () => (
		<div className="w-[420px]">
			<AuthCard variant="danger">
				<AuthCardHeader
					title="접근 실패"
					subtitle="세션을 다시 확인해 주세요."
					titleClassName="text-danger"
				/>
				<p className="text-sm text-slate-600 dark:text-slate-300">
					인증 링크가 만료되었습니다.
				</p>
			</AuthCard>
		</div>
	),
};
