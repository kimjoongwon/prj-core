import type { UserDto } from "@cocrepo/api/core/users";
import { buildUserListTableColumns, createDataGridState } from "@cocrepo/ui";
import type { Meta, StoryObj } from "@storybook/react";
import { UserListScreen, type UserListScreenProps } from "./UserListScreen";

const roleFixture = {
	associations: null,
	classification: null,
	createdAt: new Date("2026-04-14T09:00:00.000Z"),
	displayName: "운영자",
	id: BigInt(2001),
	name: "ADMIN",
	removedAt: null,
	updatedAt: null,
};

const userFixtures: UserDto[] = [
	{
		createdAt: new Date("2026-04-14T09:00:00.000Z"),
		currentTenantId: BigInt(3001),
		email: "member1@example.com",
		failedLoginAttempts: 0,
		id: BigInt(1001),
		isActive: true,
		isPermanentlyLocked: false,
		lastLoginAt: new Date("2026-04-14T09:30:00.000Z"),
		lastLoginIp: "192.0.2.10",
		lockedUntil: null,
		name: "홍길동",
		passwordChangedAt: new Date("2026-04-01T09:00:00.000Z"),
		phone: "010-1234-5670",
		removedAt: null,
		spaceId: BigInt(4001),
		tenants: [
			{
				createdAt: new Date("2026-04-14T09:00:00.000Z"),
				id: BigInt(3001),
				removedAt: null,
				role: roleFixture,
				roleId: BigInt(2001),
				spaceId: BigInt(4001),
				updatedAt: null,
				userId: BigInt(1001),
			},
		],
		updatedAt: null,
	},
	{
		createdAt: new Date("2026-04-13T09:00:00.000Z"),
		currentTenantId: null,
		email: "member2@example.com",
		failedLoginAttempts: 2,
		id: BigInt(1002),
		isActive: true,
		isPermanentlyLocked: false,
		lastLoginAt: null,
		lastLoginIp: null,
		lockedUntil: null,
		name: "김영희",
		passwordChangedAt: null,
		phone: "010-1234-5671",
		removedAt: new Date("2026-04-14T10:00:00.000Z"),
		spaceId: BigInt(4001),
		tenants: [],
		updatedAt: null,
	},
];

const defaultArgs = {
	state: {
		dataGrid: createDataGridState<UserDto>({
			query: { page: 1, take: 10, skip: 0, search: "" },
			setQueryStates: async () => new URLSearchParams(),
			table: {
				rows: userFixtures,
				columns: buildUserListTableColumns<UserDto>(),
			},
			pagination: { totalCount: 12 },
		}),
	},
} satisfies UserListScreenProps;

const meta = {
	title: "screen/UserListScreen",
	component: UserListScreen,
	argTypes: {
		state: { control: false },
	},
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs,
} satisfies Meta<typeof UserListScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
