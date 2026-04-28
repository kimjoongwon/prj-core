import type { Meta, StoryObj } from "@storybook/react";
import { AccountDetailPage } from "./AccountDetailPage";

const defaultArgs = {
	account: {
		createdAt: "2026-04-14T09:00:00.000Z",
		email: "member1@example.com",
		failedLoginAttempts: 1,
		id: "item-1",
		isActive: false,
		isPermanentlyLocked: false,
		lastLoginAt: "2026-04-14T09:00:00.000Z",
		lastLoginIp: "last-login-ip-1",
		lockedUntil: "locked-until-1",
		mustChangePassword: false,
	},
	isForceResetting: false,
	isInvalidating: false,
	isLoading: false,
	isResetting: false,
	isToggling: false,
	isUnlocking: false,
	modalAction: "unlock",
	onClickBackButton: (..._args: never[]) => undefined,
	onClickConfirmModal: (..._args: never[]) => undefined,
	onClickOpenForceResetPasswordModal: (..._args: never[]) => undefined,
	onClickOpenInvalidateSessionsModal: (..._args: never[]) => undefined,
	onClickOpenUnlockModal: (..._args: never[]) => undefined,
	onClickResetFailedAttemptsButton: (..._args: never[]) => undefined,
	onClickToggleActiveButton: (..._args: never[]) => undefined,
	onCloseModal: (..._args: never[]) => undefined,
};

const loadingArgs = {
	...defaultArgs,
	isLoading: true,
};

const meta = {
	component: AccountDetailPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof AccountDetailPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs as never,
};
