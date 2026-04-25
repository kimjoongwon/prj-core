import type { Meta, StoryObj } from "@storybook/react";
import type { RoleDetailPageProps } from "./RoleDetailPage";
import { RoleDetailPage } from "./RoleDetailPage";

const noop = (..._args: unknown[]) => undefined;

const baseAbilities = [
	{
		id: "ability-user-read",
		name: "사용자 조회",
		description: "사용자 상세 정보를 조회합니다.",
		subjectId: "subject-user",
		actionId: "action-read",
		fields: ["profile", "email"],
		conditions: { tenant: "core" },
		inverted: false,
		reason: "운영 담당자 기본 조회 권한",
		subject: {
			id: "subject-user",
			name: "User",
			displayName: "사용자",
		},
		action: {
			id: "action-read",
			name: "read",
			displayName: "조회",
		},
	},
	{
		id: "ability-user-update",
		name: "사용자 수정",
		description: "사용자 프로필을 수정합니다.",
		subjectId: "subject-user",
		actionId: "action-update",
		fields: ["profile"],
		conditions: {},
		inverted: false,
		reason: "운영 담당자 프로필 수정 권한",
		subject: {
			id: "subject-user",
			name: "User",
			displayName: "사용자",
		},
		action: {
			id: "action-update",
			name: "update",
			displayName: "수정",
		},
	},
	{
		id: "ability-audit-read",
		name: "감사 로그 조회",
		description: "감사 로그를 조회합니다.",
		subjectId: "subject-audit-log",
		actionId: "action-read",
		fields: [],
		conditions: {},
		inverted: false,
		reason: "감사 추적 전용 권한",
		subject: {
			id: "subject-audit-log",
			name: "AuditLog",
			displayName: "감사 로그",
		},
		action: {
			id: "action-read",
			name: "read",
			displayName: "조회",
		},
	},
];

const defaultArgs: RoleDetailPageProps = {
	role: {
		id: "role-operations-admin",
		name: "operations-admin",
		displayName: "운영 관리자",
		description: "문의/사용자/감사 화면 운영을 담당하는 관리자 역할입니다.",
		isSystem: true,
		removedAt: null,
		createdAt: "2026-04-14T09:00:00.000Z",
		updatedAt: "2026-04-18T11:30:00.000Z",
	},
	menuPermissions: [
		{
			groupId: "menu-user",
			groupLabel: "사용자 관리",
			leafId: "leaf-user-list",
			leafLabel: "사용자 목록",
			path: "/users",
			requiredSubjects: ["User"],
			isSelected: true,
			issues: [],
		},
		{
			groupId: "menu-audit",
			groupLabel: "감사",
			leafId: "leaf-audit-log",
			leafLabel: "감사 로그",
			path: "/audit-logs",
			requiredSubjects: ["AuditLog"],
			isSelected: false,
			issues: [
				{
					code: "missingAbility",
					severity: "warning",
					message: "감사 로그 조회 권한이 아직 연결되지 않았습니다.",
					technicalDetails: [
						"ability-audit-read 권한이 role grant에 포함되어 있지 않습니다.",
					],
					relatedAbilities: [
						{
							id: "ability-audit-read",
							label: "감사 로그 조회",
							href: "/abilities/ability-audit-read",
							isPreferred: true,
						},
					],
				},
			],
		},
	],
	menuDiagnostics: [
		{
			id: "menu-diagnostic-audit",
			severity: "warning",
			title: "감사 메뉴 접근 준비 필요",
			description: "감사 메뉴를 열기 전에 감사 로그 조회 권한을 연결해야 합니다.",
			technicalDetails: [
				"권한 저장 시 감사 로그 조회 grant를 함께 활성화해야 합니다.",
			],
			relatedAbilities: [
				{
					id: "ability-audit-read",
					label: "감사 로그 조회",
					href: "/abilities/ability-audit-read",
					isPreferred: true,
				},
			],
		},
	],
	pagePermissions: [
		{
			groupId: "page-user",
			groupLabel: "사용자",
			pageId: "page-user-detail",
			pageLabel: "사용자 상세",
			pathPattern: "/users/[userId]",
			isSelected: true,
			issues: [],
		},
		{
			groupId: "page-audit",
			groupLabel: "감사",
			pageId: "page-audit-detail",
			pageLabel: "감사 로그 상세",
			pathPattern: "/audit-logs/[logId]",
			isSelected: false,
			issues: [
				{
					code: "missingSubject",
					severity: "warning",
					message: "AuditLog subject가 page permission과 아직 연결되지 않았습니다.",
					technicalDetails: [
						"AuditLog subject를 사용하는 ability를 role에 추가하세요.",
					],
					relatedAbilities: [
						{
							id: "ability-audit-read",
							label: "감사 로그 조회",
							href: "/abilities/ability-audit-read",
							isPreferred: true,
						},
					],
				},
			],
		},
	],
	pageDiagnostics: [
		{
			id: "page-diagnostic-audit",
			severity: "warning",
			title: "상세 page 진입 권한 누락",
			description: "감사 로그 상세 page 권한이 아직 선택되지 않았습니다.",
			technicalDetails: [
				"page-audit-detail permission을 저장해야 상세 화면 이동이 가능합니다.",
			],
			relatedAbilities: [
				{
					id: "ability-audit-read",
					label: "감사 로그 조회",
					href: "/abilities/ability-audit-read",
					isPreferred: true,
				},
			],
		},
	],
	crudBundles: [
		{
			bundleId: "crud-user",
			groupLabel: "사용자",
			bundleLabel: "사용자 CRUD",
			subject: "User",
			subjectLabel: "사용자",
			description: "사용자 자원에 대한 기본 CRUD 권한 묶음입니다.",
			selectedCount: 3,
			availableCount: 4,
			actions: [
				{
					action: "create",
					label: "생성",
					isSelected: true,
					isAvailable: true,
				},
				{
					action: "read",
					label: "조회",
					isSelected: true,
					isAvailable: true,
				},
				{
					action: "update",
					label: "수정",
					isSelected: true,
					isAvailable: true,
				},
				{
					action: "delete",
					label: "삭제",
					isSelected: false,
					isAvailable: false,
					issueMessage: "삭제는 별도 승인 정책이 필요합니다.",
				},
			],
		},
	],
	grantedAdvancedAbilities: baseAbilities.slice(0, 2),
	allAdvancedAbilities: baseAbilities,
	selectedGrantItems: {
		"ability-user-read": {
			abilityId: "ability-user-read",
			isActive: true,
			priority: 10,
		},
		"ability-user-update": {
			abilityId: "ability-user-update",
			isActive: true,
			priority: 20,
		},
	},
	changeSummary: {
		added: 1,
		removed: 0,
		kept: 2,
	},
	isLoading: false,
	isLoadingAbilities: false,
	isLoadingAllAbilities: false,
	isLoadingMenuPermissions: false,
	isLoadingPagePermissions: false,
	isLoadingCrudBundles: false,
	isEditingGrants: false,
	hasChanges: true,
	hasGlobalAccess: false,
	hasBlockingPermissionDiagnostics: false,
	hasBlockingPageDiagnostics: false,
	isDeleteModalOpen: false,
	isSaveModalOpen: false,
	isDeleting: false,
	isSavingGrants: false,
	onClickBackButton: noop,
	onClickEditButton: noop,
	onClickOpenDeleteModal: noop,
	onCloseDeleteModal: noop,
	onClickDeleteConfirm: noop,
	onClickEditGrantsButton: noop,
	onClickCancelEditGrantsButton: noop,
	onToggleAbilityCheckbox: noop,
	onToggleGrantActiveSwitch: noop,
	onChangeGrantPriorityInput: noop,
	onToggleMenuPermission: noop,
	onTogglePagePermission: noop,
	onToggleCrudAction: noop,
	onClickOpenSaveGrantsModal: noop,
	onCloseSaveGrantsModal: noop,
	onClickConfirmSaveGrantsButton: noop,
	onClickOpenAbilityDetail: noop,
};

const loadingArgs: RoleDetailPageProps = {
	...defaultArgs,
	isLoading: true,
};

const busyArgs: RoleDetailPageProps = {
	...defaultArgs,
	isEditingGrants: true,
	isSaveModalOpen: true,
	isSavingGrants: true,
};

const emptyStateArgs: RoleDetailPageProps = {
	...defaultArgs,
	role: undefined,
	menuPermissions: [],
	menuDiagnostics: [],
	pagePermissions: [],
	pageDiagnostics: [],
	crudBundles: [],
	grantedAdvancedAbilities: [],
	allAdvancedAbilities: [],
	selectedGrantItems: {},
	changeSummary: {
		added: 0,
		removed: 0,
		kept: 0,
	},
	hasChanges: false,
};

const meta = {
	component: RoleDetailPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof RoleDetailPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs as never,
};

export const Busy: Story = {
	args: busyArgs as never,
};

export const EmptyState: Story = {
	args: emptyStateArgs as never,
};
