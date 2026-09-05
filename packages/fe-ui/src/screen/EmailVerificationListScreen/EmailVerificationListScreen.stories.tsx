import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { EmailVerificationListScreen } from "./EmailVerificationListScreen";

const defaultArgs: ComponentProps<typeof EmailVerificationListScreen> = {
	isLoading: false,
	onClickResendEmailVerificationButton: () => undefined,
	queryStates: { take: 20, skip: 0, email: "", status: "" },
	setQueryStates: async () => new URLSearchParams(),
	totalCount: 3,
	verifications: [
		{
			canResend: true,
			createdAt: new Date("2026-04-29T09:00:00.000Z"),
			email: "pending@example.com",
			expiresAt: new Date("2026-04-29T09:30:00.000Z"),
			id: 1n,
			lastSendStatus: "SUCCESS",
			lastSentAt: new Date("2026-04-29T09:00:00.000Z"),
			name: "홍길동",
			resendAvailableAt: new Date("2026-04-29T09:01:00.000Z"),
			sendCount: 1,
			status: "PENDING",
			updatedAt: new Date("2026-04-29T09:00:00.000Z"),
			verifiedAt: null,
			verifiedUserId: null,
		},
		{
			canResend: false,
			createdAt: new Date("2026-04-29T08:00:00.000Z"),
			email: "verified@example.com",
			expiresAt: new Date("2026-04-29T08:30:00.000Z"),
			id: 2n,
			lastSendStatus: "SUCCESS",
			lastSentAt: new Date("2026-04-29T08:00:00.000Z"),
			name: "김관리",
			resendAvailableAt: null,
			sendCount: 1,
			status: "VERIFIED",
			updatedAt: new Date("2026-04-29T08:10:00.000Z"),
			verifiedAt: new Date("2026-04-29T08:10:00.000Z"),
			verifiedUserId: 1n,
		},
	],
};

const loadingArgs = {
	...defaultArgs,
	isLoading: true,
};

const emptyStateArgs = {
	...defaultArgs,
	totalCount: 0,
	verifications: [],
};

const meta = {
	title: "screen/EmailVerificationListScreen",
	component: EmailVerificationListScreen,
	// bigint 응답 fixture는 JSON 기반 Controls 편집에서 제외합니다.
	argTypes: {
		verifications: { control: false },
	},
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs,
} satisfies Meta<typeof EmailVerificationListScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs,
};

export const EmptyState: Story = {
	args: emptyStateArgs,
};
