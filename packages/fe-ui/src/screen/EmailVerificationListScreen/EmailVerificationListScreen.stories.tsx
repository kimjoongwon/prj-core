import type { Meta, StoryObj } from "@storybook/react";
import { EmailVerificationListScreen } from "./EmailVerificationListScreen";

const defaultArgs = {
	isLoading: false,
	isResending: false,
	onConfirmResendEmailVerification: (..._args: never[]) => undefined,
	queryStates: { take: 20, skip: 0, email: "", status: "" },
	setQueryStates: (..._args: never[]) => undefined,
	totalCount: 3,
	verifications: [
		{
			canResend: true,
			createdAt: "2026-04-29T09:00:00.000Z",
			email: "pending@example.com",
			expiresAt: "2026-04-29T09:30:00.000Z",
			id: "verification-1",
			lastSendStatus: "SUCCESS",
			lastSentAt: "2026-04-29T09:00:00.000Z",
			name: "홍길동",
			resendAvailableAt: "2026-04-29T09:01:00.000Z",
			sendCount: 1,
			status: "PENDING",
			updatedAt: "2026-04-29T09:00:00.000Z",
			verifiedAt: null,
			verifiedUserId: null,
		},
		{
			canResend: false,
			createdAt: "2026-04-29T08:00:00.000Z",
			email: "verified@example.com",
			expiresAt: "2026-04-29T08:30:00.000Z",
			id: "verification-2",
			lastSendStatus: "SUCCESS",
			lastSentAt: "2026-04-29T08:00:00.000Z",
			name: "김관리",
			resendAvailableAt: null,
			sendCount: 1,
			status: "VERIFIED",
			updatedAt: "2026-04-29T08:10:00.000Z",
			verifiedAt: "2026-04-29T08:10:00.000Z",
			verifiedUserId: "user-1",
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
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof EmailVerificationListScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs as never,
};

export const EmptyState: Story = {
	args: emptyStateArgs as never,
};
