import type { Meta, StoryObj } from "@storybook/react";
import { AccountDetailScreen } from "./AccountDetailScreen";

const defaultArgs = {
	account: {
		accessGrants: [
			{
				grantedAt: "2026-04-14T09:00:00.000Z",
				roleDisplayName: "관리자",
				roleId: "role-admin",
				roleName: "admin",
				spaceId: "space-main",
				spaceLabel: "Main Space",
				spaceName: "메인 스페이스",
				tenantId: "tenant-main",
				updatedAt: "2026-04-14T09:00:00.000Z",
			},
		],
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
		name: "샘플 계정",
	},
	accessGrantForm: {
		roleId: "",
		spaceId: "",
	},
	isForceResetting: false,
	isInvalidating: false,
	isAccessGrantFormLoading: false,
	isGrantingAccess: false,
	isLoading: false,
	isResetting: false,
	isToggling: false,
	isUnlocking: false,
	modalAction: "unlock",
	roleOptions: [
		{
			description: "전체 관리 권한",
			label: "관리자",
			value: "role-admin",
		},
	],
	spaceOptions: [
		{
			description: "기본 운영 공간",
			label: "메인 스페이스",
			value: "space-main",
		},
	],
	onChangeAccessGrantRole: (..._args: never[]) => undefined,
	onChangeAccessGrantSpace: (..._args: never[]) => undefined,
	onClickBackButton: (..._args: never[]) => undefined,
	onClickConfirmModal: (..._args: never[]) => undefined,
	onClickGrantAccessButton: (..._args: never[]) => undefined,
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
	component: AccountDetailScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof AccountDetailScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs as never,
};
