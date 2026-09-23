"use client";

import type { AssetDto } from "@cocrepo/api/assets";
import type { AbilityResponseDto } from "@cocrepo/api/core/abilities";
import type { ActionDto } from "@cocrepo/api/core/actions";
import type { InquiryDto } from "@cocrepo/api/core/inquiries";
import type { RoleDto } from "@cocrepo/api/core/roles";
import type { SubjectDto } from "@cocrepo/api/core/subjects";
import type { TaskDto } from "@cocrepo/api/core/tasks";
import type { TimelineDto } from "@cocrepo/api/core/timelines";
import type { AuthAuditLogDto } from "@cocrepo/api/idp/auth";
import type { EmailVerificationDto } from "@cocrepo/api/idp/email-verifications";
import type { IdpAccountDto } from "@cocrepo/api/idp/idp-accounts";
import type { OidcClientDto } from "@cocrepo/api/idp/oidc-clients";
import type { OidcSessionDto } from "@cocrepo/api/idp/oidc-sessions";
import { Ban, Eye, Pencil, Send, Trash2 } from "lucide-react";
import {
	ActionButtonCell,
	ActionGroupCell,
	BooleanCell,
	ChipCell,
	ChipListCell,
	ConfirmActionCell,
	DateTimeCell,
	DefaultCell,
	ExpiryCell,
	LinkCell,
	NameCell,
	PhoneCell,
	ProfileAvatarCell,
	RowActionsCell,
	SummaryCell,
	SwitchCell,
	TimeRemainingCell,
	type TimeRemainingStatus,
} from "../../cell";
import {
	buildColumns,
	buildColumnsWithDefaultCreatedAt,
	createActionsColumn,
	createCreatedAtColumn,
	createDescriptionColumn,
	createDisplayNameColumn,
	createEmailColumn,
	createGroupColumn,
	createIsActiveColumn,
	createLabelColumn,
	createNameColumn,
	createPhoneColumn,
	createPresetColumn,
	createRemovedAtStatusColumn,
	createStatusColumn,
	defineColumn,
	formatAssetBytes,
	formatDuration,
	getActionGroupColor,
	getActionGroupLabel,
	getAssetKindLabel,
	getAssetStatusColor,
	getAssetStatusLabel,
} from "./dataGridFactory";

type RoleLike = {
	name?: string;
	displayName?: string | null;
};

type TenantWithRole = {
	role?: RoleLike | null;
};

type SpaceCompanyRow = {
	name: string;
	label?: string | null;
	businessNo: string;
};

type SpaceFitnessCenterRow = {
	name: string;
	label?: string | null;
	address: string;
	phone: string;
	email: string;
	company?: SpaceCompanyRow | null;
};

type SpaceTableRow = {
	id: bigint;
	contentLanguageCode: string;
	fitnessCenter?: SpaceFitnessCenterRow | null;
};

function renderRoleName(value?: string | null) {
	return <NameCell value={value} variant="identifier" />;
}

const INQUIRY_STATUS_CONFIG = {
	NEW: { label: "신규", color: "primary" },
	OPEN: { label: "열림", color: "secondary" },
	IN_PROGRESS: { label: "처리 중", color: "warning" },
	WAITING_CUSTOMER: { label: "고객 대기", color: "default" },
	RESOLVED: { label: "해결됨", color: "success" },
	CLOSED: { label: "종료됨", color: "default" },
	ESCALATED: { label: "에스컬레이션", color: "danger" },
} as const;

const INQUIRY_CATEGORY_LABEL: Record<string, string> = {
	GENERAL: "일반",
	DELIVERY: "배송",
	REFUND: "환불/취소",
	PRODUCT: "상품",
	ACCOUNT: "계정",
	TECHNICAL: "기술 지원",
	COMPLAINT: "불만/불편",
	OTHER: "기타",
};

const INQUIRY_CHANNEL_LABEL: Record<string, string> = {
	WEB: "웹 폼",
	EMAIL: "이메일",
	CHAT: "채팅",
	SMS: "SMS",
	PHONE: "전화",
	WALK_IN: "방문",
};

const INQUIRY_PRIORITY_CONFIG = {
	LOW: { label: "낮음", color: "success" },
	NORMAL: { label: "보통", color: "primary" },
	HIGH: { label: "높음", color: "warning" },
	URGENT: { label: "긴급", color: "danger" },
} as const;

const INQUIRY_SENTIMENT_CONFIG = {
	POSITIVE: { label: "긍정", color: "success" },
	NEUTRAL: { label: "중립", color: "default" },
	NEGATIVE: { label: "부정", color: "danger" },
} as const;

function getRoleLabel(role?: RoleLike | string | null) {
	if (typeof role === "string") {
		return role;
	}

	return role?.displayName || role?.name || null;
}

function getRoleColor(roleName?: string) {
	switch (roleName?.toUpperCase()) {
		case "PLATFORM_ADMIN":
		case "COMPANY_MANAGER":
			return "primary";
		case "PROJECT":
			return "secondary";
		default:
			return "default";
	}
}

/** 관리자 Action 목록에서 사용하는 기본 이름 컬럼입니다. */
export const actionNameColumn = createNameColumn<ActionDto>({
	fieldKey: "actionKey",
	accessorKey: "name",
	size: 200,
	isRequired: true,
	nameVariant: "identifier",
});

export const actionDisplayNameColumn = createDisplayNameColumn<ActionDto>({
	size: 150,
});

/** 액션 그룹을 색상 Chip으로 보여주는 컬럼입니다. */
export const actionGroupColumn = createGroupColumn<ActionDto>({
	size: 120,
	align: "center",
	cell: ({ row }) => {
		const group = row.original.group;
		return (
			<ChipCell
				label={group}
				color={group ? getActionGroupColor(group) : undefined}
			/>
		);
	},
});

export const actionOrderColumn = createPresetColumn<ActionDto>("order", {
	size: 80,
	align: "center",
});

export const actionCreatedAtColumn = createCreatedAtColumn<ActionDto>({
	size: 150,
});

/** removedAt 기반 상태를 표시하는 Action 상태 컬럼입니다. */
export const actionRemovedAtColumn = createRemovedAtStatusColumn<ActionDto>({
	size: 100,
});

/** Action 목록 페이지용 컬럼 조합을 생성합니다. */
export function buildActionTableColumns<
	TRow extends {
		id: bigint;
		name: string;
		displayName?: string | null;
		group?: string | null;
		createdAt: Date | null;
		removedAt?: Date | null;
	},
>(options: { onClickDetailButton?: (row: TRow) => void } = {}) {
	const columns = buildColumns<TRow>(
		createNameColumn<TRow>({
			fieldKey: "actionKey",
			accessorKey: "name",
			size: 200,
			isRequired: true,
			nameVariant: "identifier",
		}),
		createDisplayNameColumn<TRow>({
			size: 150,
		}),
		createGroupColumn<TRow>({
			size: 120,
			align: "center",
			cell: ({ row }) => {
				const group = row.original.group ?? undefined;
				return (
					<ChipCell
						label={getActionGroupLabel(group)}
						color={group ? getActionGroupColor(group) : undefined}
					/>
				);
			},
		}),
		createCreatedAtColumn<TRow>({
			size: 150,
		}),
		createRemovedAtStatusColumn<TRow>({
			size: 100,
		}),
	);

	if (!options.onClickDetailButton) {
		return columns;
	}

	return buildColumns<TRow>(
		...columns,
		createActionsColumn<TRow>({
			label: "상세",
			size: 100,
			cell: ({ row }) => (
				<ActionButtonCell
					variant="ghost"
					onPress={() => {
						options.onClickDetailButton?.(row.original);
					}}
				>
					상세
				</ActionButtonCell>
			),
		}),
	);
}

/** Action 목록 페이지에서 사용하는 기본 컬럼 조합입니다. */
export const actionTableColumns = buildActionTableColumns<ActionDto>();

export function buildUserListTableColumns<
	TRow extends {
		id: bigint;
		name: string;
		email?: string | null;
		phone?: string | null;
		removedAt?: Date | null;
		createdAt: Date;
		tenants?: TenantWithRole[] | null;
	},
>() {
	/** 사용자 목록 페이지용 컬럼 조합을 생성합니다. */
	return buildColumns<TRow>(
		createNameColumn<TRow>({
			cell: ({ row }) => (
				<LinkCell href={`/admin/users/${row.original.id}`}>
					{row.original.name}
				</LinkCell>
			),
		}),
		createEmailColumn<TRow>({
			size: 240,
		}),
		createPhoneColumn<TRow>({
			size: 150,
			cell: ({ row }) => (
				<PhoneCell
					value={row.original.phone}
					className="text-sm font-medium tabular-nums text-foreground/80"
				/>
			),
		}),
		createPresetColumn<TRow>("role", {
			size: 120,
			align: "center",
			cell: ({ row }) => {
				const firstRole = row.original.tenants?.[0]?.role;
				const roleLabel = getRoleLabel(firstRole);

				return (
					<ChipCell label={roleLabel} color={getRoleColor(firstRole?.name)} />
				);
			},
		}),
		createStatusColumn<TRow>({
			size: 100,
			cell: ({ row }) => (
				<ChipCell
					label={row.original.removedAt ? "탈퇴대기" : "활성"}
					color={row.original.removedAt ? "danger" : "success"}
				/>
			),
		}),
		createCreatedAtColumn<TRow>({
			fieldKey: "signedUpAt",
			accessorKey: "createdAt",
		}),
	);
}

export const subjectNameColumn = createNameColumn<SubjectDto>({
	fieldKey: "subjectKey",
	accessorKey: "name",
	size: 220,
	isRequired: true,
	nameVariant: "identifier",
});

export const subjectDisplayNameColumn = createDisplayNameColumn<SubjectDto>();

export const subjectGroupColumn = createGroupColumn<SubjectDto>();

export const subjectCreatedAtColumn = createCreatedAtColumn<SubjectDto>({
	size: 160,
});

export const subjectRemovedAtColumn = createRemovedAtStatusColumn<SubjectDto>();

function getSubjectGroupLabel(group?: string | null) {
	switch (group) {
		case "all":
			return "공통";
		case "entity":
			return "데이터";
		case "menu":
			return "메뉴";
		case "page":
			return "화면";
		case "feature":
			return "기능";
		case "ui":
			return "화면 요소";
		default:
			return group ?? "";
	}
}

function getSubjectGroupColor(
	group?: string | null,
): "default" | "primary" | "secondary" | "success" | "warning" {
	switch (group) {
		case "entity":
			return "primary";
		case "menu":
			return "secondary";
		case "page":
			return "success";
		case "feature":
			return "warning";
		default:
			return "default";
	}
}

function getSubjectDisplayLabel(subject: {
	name: string;
	displayName?: string | null;
}) {
	if (subject.displayName) {
		return subject.displayName;
	}

	if (!subject.name.includes(":")) {
		return subject.name;
	}

	const parts = subject.name.split(":");
	return parts[parts.length - 1] ?? subject.name;
}

function getSubjectUsageDescription(subject: {
	name: string;
	displayName?: string | null;
	group?: string | null;
}) {
	const label = getSubjectDisplayLabel(subject);

	switch (subject.group) {
		case "all":
			return "여러 영역에 공통으로 적용되는 권한 대상입니다.";
		case "entity":
			return `${label} 데이터에 대한 조회, 생성, 수정 같은 접근 권한을 제어합니다.`;
		case "menu":
			return `${label} 메뉴가 내비게이션에 보이는지 제어합니다.`;
		case "page":
			return `${label} 화면에 진입할 수 있는지 제어합니다.`;
		case "feature":
			return `${label} 기능을 실행할 수 있는지 제어합니다.`;
		case "ui":
			return `${label} 같은 화면 요소를 보거나 사용할 수 있는지 제어합니다.`;
		default:
			return "역할과 정책에서 허용 범위를 판단할 때 사용하는 관리 대상입니다.";
	}
}

/** Subject 목록 페이지용 컬럼 조합을 생성합니다. */
export function buildSubjectTableColumns<
	TRow extends {
		name: string;
		displayName?: string | null;
		group?: string | null;
		createdAt: Date | null;
		removedAt?: Date | null;
	},
>() {
	return buildColumns<TRow>(
		createDisplayNameColumn<TRow>({
			label: "대상",
			size: 220,
			isRequired: true,
			cell: ({ row }) => (
				<SummaryCell
					primary={getSubjectDisplayLabel(row.original)}
					secondary={`${getSubjectGroupLabel(row.original.group)} 권한 대상`}
				/>
			),
		}),
		createGroupColumn<TRow>({
			label: "유형",
			size: 120,
			align: "center",
			cell: ({ row }) => {
				const group = row.original.group;
				return (
					<ChipCell
						label={getSubjectGroupLabel(group)}
						color={getSubjectGroupColor(group)}
					/>
				);
			},
		}),
		createPresetColumn<TRow>("description", {
			label: "설명",
			size: 360,
			cell: ({ row }) => (
				<DefaultCell
					value={getSubjectUsageDescription(row.original)}
					tone="muted"
					lineClamp={2}
				/>
			),
		}),
		createCreatedAtColumn<TRow>({
			size: 160,
		}),
		createRemovedAtStatusColumn<TRow>(),
	);
}

/** Subject 목록 페이지에서 사용하는 전체 컬럼 조합입니다. */
export const subjectTableColumns = buildSubjectTableColumns<SubjectDto>();

export const adminRoleNameColumn = createNameColumn<RoleDto>({
	fieldKey: "roleKey",
	accessorKey: "name",
	size: 180,
	isRequired: true,
	nameVariant: "identifier",
	cell: ({ row }) => renderRoleName(row.original.name),
});

export const adminRoleDisplayNameColumn = createDisplayNameColumn<RoleDto>();

export const adminRoleDescriptionColumn = createDescriptionColumn<RoleDto>();

export const adminRoleStatusColumn = createRemovedAtStatusColumn<RoleDto>({
	size: 100,
});

export const adminRoleActionsColumn = createActionsColumn<RoleDto>({
	size: 100,
	cell: ({ row }) => (
		<LinkCell
			className="inline-flex h-8 items-center justify-center px-3 text-sm"
			href={`/admin/roles/${row.original.id}`}
		>
			상세
		</LinkCell>
	),
});

/** 역할 목록 페이지용 컬럼 조합을 생성합니다. */
export function buildAdminRoleTableColumns<
	TRow extends {
		id: bigint;
		name: string;
		displayName?: string | null;
		description?: string | null;
		createdAt: Date | null;
		removedAt?: Date | null;
	},
>() {
	return buildColumnsWithDefaultCreatedAt<TRow>(
		[
			createNameColumn<TRow>({
				fieldKey: "roleKey",
				accessorKey: "name",
				size: 180,
				isRequired: true,
				nameVariant: "identifier",
				cell: ({ row }) => renderRoleName(row.original.name),
			}),
			createDisplayNameColumn<TRow>(),
			createDescriptionColumn<TRow>(),
			createRemovedAtStatusColumn<TRow>({
				size: 100,
			}),
		],
		[
			createActionsColumn<TRow>({
				size: 100,
				cell: ({ row }) => (
					<LinkCell
						className="inline-flex h-8 items-center justify-center px-3 text-sm"
						href={`/admin/roles/${row.original.id}`}
					>
						상세
					</LinkCell>
				),
			}),
		],
	);
}

/** 역할 목록 페이지에서 사용하는 전체 컬럼 조합입니다. */
export const adminRoleTableColumns = buildAdminRoleTableColumns<RoleDto>();

/** 권한 목록 페이지용 컬럼 조합을 생성합니다. */
export function buildAbilityListTableColumns<
	TRow extends AbilityResponseDto = AbilityResponseDto,
>() {
	return buildColumnsWithDefaultCreatedAt<TRow>([
		createNameColumn<TRow>({
			label: "규칙",
			size: 240,
			cell: ({ row }) => (
				<SummaryCell
					primary={row.original.name}
					secondary={row.original.description}
					statusLabel={row.original.inverted ? "거부" : "허용"}
					statusColor={row.original.inverted ? "danger" : "success"}
				/>
			),
		}),
		createPresetColumn<TRow>("subjectLabel", {
			label: "대상",
			size: 160,
			cell: ({ row }) => (
				<DefaultCell
					value={
						row.original.subject?.displayName ??
						row.original.subject?.name ??
						"-"
					}
				/>
			),
		}),
		createPresetColumn<TRow>("actionLabel", {
			label: "행동",
			size: 140,
			cell: ({ row }) => (
				<DefaultCell
					value={
						row.original.action?.displayName ?? row.original.action?.name ?? "-"
					}
				/>
			),
		}),
		createPresetColumn<TRow>("fieldCount", {
			label: "적용 범위",
			size: 120,
			align: "center",
			cell: ({ row }) => {
				const fieldCount = row.original.fields.length;
				return (
					<ChipCell
						label={fieldCount === 0 ? "전체" : `${fieldCount}개 필드`}
						color={fieldCount === 0 ? "default" : "warning"}
					/>
				);
			},
		}),
		createPresetColumn<TRow>("hasConditions", {
			label: "조건",
			size: 100,
			align: "center",
			cell: ({ row }) => (
				<BooleanCell
					value={Boolean(
						row.original.conditions &&
							Object.keys(row.original.conditions).length > 0,
					)}
					trueLabel="있음"
					falseLabel="없음"
					trueColor="primary"
					falseColor="default"
				/>
			),
		}),
	]);
}

/** 태스크 목록에서 표시하는 필드만 사용하여 역방향 관계를 요구하지 않습니다. */
export type TaskTableRow = Pick<TaskDto, "id" | "createdAt"> & {
 exercise: Pick<TaskDto["exercise"], "name" | "videoFileId" | "duration" | "count" | "description">;
};

export function buildTaskTableColumns<TRow extends TaskTableRow = TaskTableRow>({
	onClickTaskName,
	onClickDeleteButton,
}: {
	onClickTaskName: (taskId: bigint) => void;
	onClickDeleteButton: (taskId: bigint) => void;
}) {
	/** Task 목록 페이지용 컬럼 조합을 생성합니다. */
	return buildColumnsWithDefaultCreatedAt<TRow>(
		[
			createNameColumn<TRow>({
				nameVariant: "clickable",
				accessorKey: "exercise.name",
				onClickName: (row) => onClickTaskName(row.id),
			}),
			createPresetColumn<TRow>("isSchedulable", {
				size: 110,
				align: "center",
				cell: ({ row }) => (
					<BooleanCell
						value={Boolean(row.original.exercise.videoFileId)}
						trueLabel="가능"
						falseLabel="불가"
						trueColor="success"
						falseColor="warning"
					/>
				),
			}),
			createPresetColumn<TRow, TRow["exercise"]["duration"]>("duration", {
				accessorKey: "exercise.duration",
				size: 100,
				align: "center",
				cell: ({ getValue }) => (
					<DefaultCell value={formatDuration(getValue())} />
				),
			}),
			createPresetColumn<TRow, TRow["exercise"]["count"]>("count", {
				accessorKey: "exercise.count",
				size: 80,
				align: "center",
				cell: ({ getValue }) => <DefaultCell value={`${getValue()}회`} />,
			}),
			createDescriptionColumn<TRow>({
				accessorKey: "exercise.description",
				cell: ({ row }) => (
					<DefaultCell
						value={row.original.exercise.description}
						tone="muted"
						lineClamp={2}
					/>
				),
			}),
		],
		[
			createActionsColumn<TRow>({
				cell: ({ row }) => (
					<ConfirmActionCell
						title="태스크 삭제"
						description="태스크와 연결된 운동 detail을 삭제합니다."
						onConfirm={() => onClickDeleteButton(row.original.id)}
					/>
				),
			}),
		],
	);
}

export function buildTimelineTableColumns<
	TRow extends TimelineDto = TimelineDto,
>({
	onClickDeleteButton,
}: {
	onClickDeleteButton: (timelineId: bigint) => void;
}) {
	/** Timeline 목록 페이지용 컬럼 조합을 생성합니다. */
	return buildColumnsWithDefaultCreatedAt<TRow>(
		[
			createNameColumn<TRow>({
				nameVariant: "plain",
				cell: ({ row }) => (
					<LinkCell
						href={`/timelines/${row.original.id}`}
						className="text-accent hover:underline"
						onClick={(event) => {
							event.stopPropagation();
						}}
					>
						{row.original.name}
					</LinkCell>
				),
			}),
			createDescriptionColumn<TRow>({
				size: 300,
				cell: ({ row }) => (
					<DefaultCell
						value={row.original.description}
						tone="muted"
						lineClamp={1}
					/>
				),
			}),
		],
		[
			createActionsColumn<TRow>({
				cell: ({ row }) => (
					<ConfirmActionCell
						title="타임라인 삭제"
						description="선택한 타임라인을 삭제합니다."
						onConfirm={() => onClickDeleteButton(row.original.id)}
					/>
				),
			}),
		],
	);
}

export function buildTemplateTableColumns<
	TRow extends {
		id: bigint;
		code: string;
		name: string;
		isActive: boolean;
		createdAt: Date | null;
	},
>({
	onClickTemplateCode,
	onToggleTemplateStatusSwitch,
}: {
	onClickTemplateCode: (templateId: bigint) => void;
	onToggleTemplateStatusSwitch: (templateId: bigint) => Promise<void>;
}) {
	/** Template 목록 페이지용 컬럼 조합을 생성합니다. */
	return buildColumns<TRow>(
		createPresetColumn<TRow>("code", {
			size: 220,
			isRequired: true,
			cell: ({ row }) => (
				<ActionButtonCell
					align="start"
					className="justify-start p-0 font-mono text-sm"
					variant="ghost"
					onPress={() => onClickTemplateCode(row.original.id)}
				>
					{row.original.code}
				</ActionButtonCell>
			),
		}),
		createNameColumn<TRow>({
			size: 220,
		}),
		createIsActiveColumn<TRow>({
			cell: ({ row }) => (
				<SwitchCell
					isSelected={row.original.isActive}
					onToggle={() => onToggleTemplateStatusSwitch(row.original.id)}
				/>
			),
		}),
		createCreatedAtColumn<TRow>({
			size: 160,
		}),
	);
}

export function buildSpaceTableColumns<
	TRow extends SpaceTableRow = SpaceTableRow,
>({
	onClickSpaceFitnessCenterName,
}: {
	onClickSpaceFitnessCenterName: (spaceId: bigint) => void;
}) {
	const contentLanguageLabels: Record<string, string> = {
		ko_KR: "한국어",
		en_US: "English",
		zh_CN: "中文",
		ja_JP: "日本語",
	};

	/** Space 목록 페이지용 컬럼 조합을 생성합니다. */
	return buildColumnsWithDefaultCreatedAt<TRow>([
		createNameColumn<TRow>({
			nameVariant: "clickable",
			accessorKey: "fitnessCenter.name",
			onClickName: (row) => onClickSpaceFitnessCenterName(row.id),
		}),
		createLabelColumn<TRow>({
			accessorKey: "fitnessCenter.label",
			size: 120,
			align: "center",
			cell: ({ row }) => (
				<ChipCell label={row.original.fitnessCenter?.label} color="secondary" />
			),
		}),
		defineColumn<TRow, TRow["contentLanguageCode"]>({
			field: "contentLanguageCode",
			label: "콘텐츠 언어",
			size: 130,
			cell: ({ getValue }) => (
				<ChipCell
					label={contentLanguageLabels[String(getValue() ?? "")] ?? "미설정"}
					color="primary"
				/>
			),
		}),
		createPresetColumn<TRow>("businessNo", {
			accessorKey: "fitnessCenter.company.businessNo",
			size: 160,
		}),
		createPresetColumn<TRow>("address", {
			accessorKey: "fitnessCenter.address",
			size: 250,
		}),
		createPhoneColumn<TRow>({
			accessorKey: "fitnessCenter.phone",
		}),
		createEmailColumn<TRow>({
			accessorKey: "fitnessCenter.email",
		}),
	]);
}

export function buildRoutineTableColumns<
	TRow extends {
		id: bigint;
		name: string;
		label?: string | null;
		createdAt: Date | null;
	},
>({
	onClickRoutineName,
	onClickDeleteButton,
}: {
	onClickRoutineName: (routineId: bigint) => void;
	onClickDeleteButton: (routineId: bigint) => void;
}) {
	/** Routine 목록 페이지용 컬럼 조합을 생성합니다. */
	return buildColumnsWithDefaultCreatedAt<TRow>(
		[
			createNameColumn<TRow>({
				nameVariant: "clickable",
				onClickName: (row) => onClickRoutineName(row.id),
			}),
			createLabelColumn<TRow>({
				cell: ({ row }) => (
					<DefaultCell value={row.original.label} tone="muted" />
				),
			}),
		],
		[
			createActionsColumn<TRow>({
				cell: ({ row }) => (
					<ConfirmActionCell
						title="루틴 삭제"
						description="선택한 루틴을 삭제합니다."
						onConfirm={() => onClickDeleteButton(row.original.id)}
					/>
				),
			}),
		],
	);
}

export function buildAssetTableColumns<
	TRow extends {
		id: string;
		originalName: string;
		kind: AssetDto["kind"];
		status: AssetDto["status"];
		mimeType: string;
		sizeBytes: number;
		createdAt: AssetDto["createdAt"];
	},
>({
	isRemoving,
	onClickDeleteAssetButton,
	onClickPreviewAssetButton,
	mode = "manage",
	onClickSelectAssetButton,
	selectedAssetId,
}: {
	isRemoving: boolean;
	onClickDeleteAssetButton: (assetId: string) => void;
	onClickPreviewAssetButton?: (asset: TRow) => void;
	mode?: "manage" | "picker";
	onClickSelectAssetButton?: (asset: TRow) => void;
	selectedAssetId?: string;
}) {
	/** Asset 목록 페이지용 컬럼 조합을 생성합니다. */
	return buildColumnsWithDefaultCreatedAt<TRow>(
		[
			createPresetColumn<TRow>("originalName", {
				size: 280,
				isRequired: true,
				cell: ({ row }) =>
					mode === "picker" ? (
						<DefaultCell value={row.original.originalName} />
					) : (
						<LinkCell
							href={`/assets/${row.original.id}`}
							className="text-accent hover:underline"
						>
							{row.original.originalName}
						</LinkCell>
					),
			}),
			createPresetColumn<TRow>("kind", {
				size: 100,
				align: "center",
				cell: ({ row }) => (
					<ChipCell
						label={getAssetKindLabel(row.original.kind)}
						color="secondary"
					/>
				),
			}),
			createStatusColumn<TRow>({
				cell: ({ row }) => (
					<ChipCell
						label={getAssetStatusLabel(row.original.status)}
						color={getAssetStatusColor(row.original.status)}
					/>
				),
			}),
			createPresetColumn<TRow, TRow["mimeType"]>("mimeType", {
				size: 180,
				cell: ({ getValue }) => (
					<DefaultCell value={getValue()} mono size="xs" />
				),
			}),
			createPresetColumn<TRow, TRow["sizeBytes"]>("sizeBytes", {
				size: 120,
				align: "right",
				cell: ({ getValue }) => (
					<DefaultCell value={formatAssetBytes(getValue())} />
				),
			}),
		],
		[
			createActionsColumn<TRow>({
				size: 220,
				align: "center",
				cell: ({ row }) => {
					if (mode === "picker") {
						const isSelected = row.original.id === selectedAssetId;

						return (
							<ActionGroupCell gap="md">
								{onClickSelectAssetButton ? (
									<ActionButtonCell
										variant={isSelected ? "primary" : "ghost"}
										onPress={() => onClickSelectAssetButton(row.original)}
									>
										{isSelected ? "선택됨" : "선택"}
									</ActionButtonCell>
								) : null}
								<ActionButtonCell
									variant="danger-soft"
									isDisabled={isRemoving}
									onPress={() => onClickDeleteAssetButton(row.original.id)}
								>
									삭제
								</ActionButtonCell>
							</ActionGroupCell>
						);
					}

					return (
						<ActionGroupCell gap="md">
							{onClickPreviewAssetButton ? (
								<ActionButtonCell
									variant="ghost"
									onPress={() => onClickPreviewAssetButton(row.original)}
								>
									<Eye className="h-4 w-4" aria-hidden />
									보기
								</ActionButtonCell>
							) : null}
							<ActionButtonCell
								variant="danger-soft"
								isDisabled={isRemoving}
								onPress={() => onClickDeleteAssetButton(row.original.id)}
							>
								삭제
							</ActionButtonCell>
						</ActionGroupCell>
					);
				},
			}),
		],
	);
}

export const assetTableColumns = buildAssetTableColumns<AssetDto>({
	isRemoving: false,
	onClickDeleteAssetButton: () => undefined,
});

export function buildInquiryTableColumns<
	TRow extends InquiryDto = InquiryDto,
>() {
	/** Inquiry 목록 페이지용 컬럼 조합을 생성합니다. */
	return buildColumns<TRow>(
		createPresetColumn<TRow>("customerName", {
			size: 180,
			isRequired: true,
			cell: ({ row }) => (
				<ProfileAvatarCell
					name={row.original.customerId ?? "고객"}
					subtitle={row.original.customerId ?? "-"}
				/>
			),
		}),
		createPresetColumn<TRow, TRow["title"]>("title", {
			size: 260,
			isRequired: true,
			cell: ({ getValue }) => <DefaultCell value={getValue()} lineClamp={2} />,
		}),
		createStatusColumn<TRow>({
			size: 130,
			cell: ({ getValue }) => {
				const status = String(getValue() ?? "");
				const config = INQUIRY_STATUS_CONFIG[
					status as keyof typeof INQUIRY_STATUS_CONFIG
				] ?? {
					label: status,
					color: "default" as const,
				};

				return <ChipCell label={config.label} color={config.color} />;
			},
		}),
		createPresetColumn<TRow>("category", {
			size: 140,
			align: "center",
			cell: ({ getValue }) => {
				const category = String(getValue() ?? "");
				return (
					<ChipCell
						label={INQUIRY_CATEGORY_LABEL[category] ?? category}
						color="default"
					/>
				);
			},
		}),
		createPresetColumn<TRow>("channel", {
			size: 120,
			align: "center",
			cell: ({ getValue }) => {
				const channel = String(getValue() ?? "");
				return (
					<ChipCell
						label={INQUIRY_CHANNEL_LABEL[channel] ?? channel}
						color="default"
					/>
				);
			},
		}),
		createPresetColumn<TRow>("priority", {
			size: 130,
			align: "center",
			cell: ({ getValue }) => {
				const priority = String(getValue() ?? "");
				const config = INQUIRY_PRIORITY_CONFIG[
					priority as keyof typeof INQUIRY_PRIORITY_CONFIG
				] ?? {
					label: priority,
					color: "default" as const,
				};

				return <ChipCell label={config.label} color={config.color} />;
			},
		}),
		createPresetColumn<TRow>("assigneeName", {
			size: 150,
			align: "center",
			cell: ({ row }) => (
				<DefaultCell value={row.original.assigneeId} placeholder="미배정" />
			),
		}),
		createPresetColumn<TRow>("sentiment", {
			size: 100,
			align: "center",
			cell: ({ getValue }) => {
				const sentiment = String(getValue() ?? "");
				const config = INQUIRY_SENTIMENT_CONFIG[
					sentiment as keyof typeof INQUIRY_SENTIMENT_CONFIG
				] ?? {
					label: sentiment,
					color: "default" as const,
				};

				return <ChipCell label={config.label} color={config.color} />;
			},
		}),
		createPresetColumn<TRow>("slaStatus", {
			size: 120,
			align: "center",
			cell: ({ row }) => (
				<TimeRemainingCell
					status={getInquirySlaStatus(row.original)}
					remainingMinutes={getInquirySlaRemainingMinutes(row.original)}
					breachLabel="SLA 위반"
				/>
			),
		}),
		createPresetColumn<TRow>("unreadCount", {
			size: 100,
			align: "center",
			cell: ({ getValue }) => {
				const unreadCount = Number(getValue() ?? 0);

				return unreadCount > 0 ? (
					<ChipCell label={unreadCount} color="primary" variant="solid" />
				) : (
					<DefaultCell value={null} />
				);
			},
		}),
		createCreatedAtColumn<TRow>({
			fieldKey: "receivedAt",
			accessorKey: "createdAt",
			size: 160,
		}),
	);
}

function getInquirySlaRemainingMinutes(
	inquiry: InquiryDto,
): number | undefined {
	if (!inquiry.slaResponseDue) {
		return undefined;
	}

	return Math.floor(
		(new Date(inquiry.slaResponseDue).getTime() - Date.now()) / 60000,
	);
}

function getInquirySlaStatus(
	inquiry: InquiryDto,
): TimeRemainingStatus | undefined {
	if (inquiry.isSlaResponseBreached || inquiry.isSlaResolveBreached) {
		return "breach";
	}

	const remainingMinutes = getInquirySlaRemainingMinutes(inquiry);
	if (typeof remainingMinutes !== "number") {
		return undefined;
	}

	if (remainingMinutes <= 60) {
		return "warning";
	}

	return "ok";
}

export function getStaticTranslationLanguageLabel(
	languageCode?: string | null,
) {
	switch (languageCode) {
		case "ko_KR":
			return "한국어";
		case "en_US":
			return "영어";
		case "zh_CN":
			return "중국어";
		case "ja_JP":
			return "일본어";
		default:
			return languageCode ?? "";
	}
}

function getStaticTranslationCategoryColor(
	category?: string | null,
): "default" | "primary" | "secondary" | "success" | "warning" {
	switch (category) {
		case "common":
		case "공통":
			return "primary";
		case "error":
		case "에러":
			return "warning";
		case "validation":
		case "검증":
			return "secondary";
		case "menu":
		case "API 응답":
			return "success";
		default:
			return "default";
	}
}

export function buildStaticTranslationTableColumns<
	TRow extends {
		id: string;
		languageCode: string;
		key: string;
		text: string;
		category: string;
		isTranslated: boolean;
		updatedAt: Date | null;
	},
>(options: {
	onClickEditButton: (translation: TRow) => void;
	onClickDeleteButton: (translation: TRow) => void;
}) {
	return buildColumns<TRow>(
		defineColumn<TRow, TRow["languageCode"]>({
			field: "languageCode",
			label: "언어",
			size: 110,
			align: "center",
			cell: ({ getValue }) => (
				<ChipCell label={getStaticTranslationLanguageLabel(getValue())} />
			),
		}),
		defineColumn<TRow, TRow["key"]>({
			field: "key",
			label: "번역 키",
			size: 260,
			isRequired: true,
			cell: ({ getValue }) => <DefaultCell value={getValue()} mono truncate />,
		}),
		defineColumn<TRow, TRow["category"]>({
			field: "category",
			label: "카테고리",
			size: 130,
			align: "center",
			cell: ({ getValue }) => {
				const category = getValue();
				return (
					<ChipCell
						label={category}
						color={getStaticTranslationCategoryColor(category)}
					/>
				);
			},
		}),
		defineColumn<TRow, TRow["text"]>({
			field: "text",
			label: "번역문",
			size: 420,
			isRequired: true,
			cell: ({ getValue }) => <DefaultCell value={getValue()} lineClamp={2} />,
		}),
		defineColumn<TRow, TRow["isTranslated"]>({
			field: "isTranslated",
			label: "완료",
			size: 100,
			align: "center",
			cell: ({ getValue }) => (
				<BooleanCell
					value={getValue()}
					trueLabel="완료"
					falseLabel="대기"
					trueColor="success"
					falseColor="warning"
				/>
			),
		}),
		defineColumn<TRow, TRow["updatedAt"]>({
			field: "updatedAt",
			label: "수정일",
			size: 150,
			cell: ({ getValue }) => <DateTimeCell value={getValue()} />,
		}),
		createActionsColumn<TRow>({
			label: "관리",
			size: 120,
			cell: ({ row }) => (
				<ActionGroupCell>
					<ActionButtonCell
						isIconOnly
						variant="ghost"
						aria-label="번역 수정"
						onPress={() => {
							options.onClickEditButton(row.original);
						}}
					>
						<Pencil className="h-4 w-4" />
					</ActionButtonCell>
					<ActionButtonCell
						isIconOnly
						variant="danger-soft"
						aria-label="번역 삭제"
						onPress={() => {
							options.onClickDeleteButton(row.original);
						}}
					>
						<Trash2 className="h-4 w-4" />
					</ActionButtonCell>
				</ActionGroupCell>
			),
		}),
	);
}

const EMAIL_VERIFICATION_STATUS_CONFIG = {
	PENDING: { label: "대기", color: "warning" },
	VERIFIED: { label: "인증 완료", color: "success" },
	EXPIRED: { label: "만료", color: "danger" },
} as const;

const EMAIL_SEND_STATUS_CONFIG = {
	SUCCESS: { label: "성공", color: "success" },
	FAILURE: { label: "실패", color: "danger" },
} as const;

const AUTH_METHOD_CONFIG = {
	client_secret_basic: { label: "Basic", color: "primary" },
	client_secret_post: { label: "Post", color: "secondary" },
	none: { label: "None (Public)", color: "warning" },
} as const;

const GRANT_TYPE_LABEL: Record<string, string> = {
	authorization_code: "Auth Code",
	client_credentials: "Client Cred",
	refresh_token: "Refresh",
};

const AUDIT_RESULT_CONFIG = {
	SUCCESS: { label: "성공", color: "success" },
	FAILURE: { label: "실패", color: "danger" },
	LOCKED: { label: "잠금", color: "warning" },
} as const;

const MODEL_TYPE_CONFIG = {
	AccessToken: { label: "Access Token", color: "primary" },
	RefreshToken: { label: "Refresh Token", color: "secondary" },
	AuthorizationCode: { label: "Auth Code", color: "warning" },
	Session: { label: "Session", color: "success" },
	Grant: { label: "Grant", color: "default" },
	ClientCredentials: { label: "Client Cred", color: "primary" },
	DeviceCode: { label: "Device Code", color: "warning" },
	Interaction: { label: "Interaction", color: "success" },
} as const;

function getAuthMethodConfig(method: string) {
	return (
		AUTH_METHOD_CONFIG[method as keyof typeof AUTH_METHOD_CONFIG] ?? {
			label: method,
			color: "default" as const,
		}
	);
}

function getAuditResultConfig(result: string) {
	return (
		AUDIT_RESULT_CONFIG[result as keyof typeof AUDIT_RESULT_CONFIG] ?? {
			label: result,
			color: "danger" as const,
		}
	);
}

function getModelTypeConfig(modelType: string) {
	return (
		MODEL_TYPE_CONFIG[modelType as keyof typeof MODEL_TYPE_CONFIG] ?? {
			label: modelType,
			color: "default" as const,
		}
	);
}

function getLockStatusConfig(account: {
	isPermanentlyLocked: boolean;
	lockedUntil?: Date | null;
}) {
	if (account.isPermanentlyLocked) {
		return { label: "영구잠금", color: "danger" as const };
	}

	if (account.lockedUntil) {
		return { label: "일시잠금", color: "warning" as const };
	}

	return { label: "정상", color: "success" as const };
}

/** OIDC Client 목록에서 사용하는 clientId 컬럼입니다. */
export const oidcClientIdColumn = createPresetColumn<
	OidcClientDto,
	OidcClientDto["clientId"]
>("clientId", {
	size: 200,
	isRequired: true,
	cell: ({ getValue }) => <DefaultCell value={getValue()} mono />,
});

export const oidcClientNameColumn = createPresetColumn<OidcClientDto>("name", {
	size: 200,
});

/** OIDC Client 인증 방식을 Chip으로 표시하는 컬럼입니다. */
export const oidcClientAuthMethodColumn = createPresetColumn<
	OidcClientDto,
	OidcClientDto["tokenEndpointAuthMethod"]
>("tokenEndpointAuthMethod", {
	size: 150,
	cell: ({ getValue }) => {
		const config = getAuthMethodConfig(getValue());
		return <ChipCell label={config.label} color={config.color} />;
	},
});

export const oidcClientGrantTypesColumn = createPresetColumn<
	OidcClientDto,
	OidcClientDto["grantTypes"]
>("grantTypes", {
	size: 200,
	cell: ({ getValue }) => {
		const types = getValue();

		if (!types?.length) {
			return <DefaultCell value={null} />;
		}

		return (
			<ChipListCell
				labels={types.map((type) => GRANT_TYPE_LABEL[type] ?? type)}
			/>
		);
	},
});

/** OIDC Client 활성 상태를 표시하는 컬럼입니다. */
export const oidcClientIsActiveColumn = createIsActiveColumn<OidcClientDto>({
	size: 80,
	cell: ({ getValue }) => {
		const isActive = Boolean(getValue());
		return (
			<ChipCell
				label={isActive ? "활성" : "비활성"}
				color={isActive ? "success" : "default"}
			/>
		);
	},
});

export const oidcClientCreatedAtColumn = createCreatedAtColumn<OidcClientDto>();

/** OIDC Client 행 액션을 RowActionsCell로 표시하는 컬럼입니다. */
export const oidcClientActionsColumn = createActionsColumn<OidcClientDto>({
	size: 100,
	cell: ({ row }) => (
		<RowActionsCell
			id={row.original.id}
			basePath="/settings/auth/oidc-clients"
			showView
			showEdit={false}
			showDelete={false}
		/>
	),
});

/** OIDC Client 목록 페이지용 컬럼 조합을 생성합니다. */
export function buildOidcClientTableColumns<
	TRow extends {
		id: bigint;
		clientId: string;
		name: string;
		tokenEndpointAuthMethod: string;
		grantTypes: string[];
		isFirstParty: boolean;
		skipConsent: boolean;
		isActive: boolean;
		createdAt: Date | null;
	},
>() {
	return buildColumns<TRow>(
		createPresetColumn<TRow, TRow["clientId"]>("clientId", {
			size: 200,
			isRequired: true,
			cell: ({ getValue }) => <DefaultCell value={getValue()} mono />,
		}),
		createPresetColumn<TRow>("name", {
			size: 200,
		}),
		createPresetColumn<TRow, TRow["tokenEndpointAuthMethod"]>(
			"tokenEndpointAuthMethod",
			{
				size: 150,
				cell: ({ getValue }) => {
					const config = getAuthMethodConfig(getValue());
					return <ChipCell label={config.label} color={config.color} />;
				},
			},
		),
		createPresetColumn<TRow, TRow["grantTypes"]>("grantTypes", {
			size: 200,
			cell: ({ getValue }) => {
				const types = getValue();

				if (!types?.length) {
					return <DefaultCell value={null} />;
				}

				return (
					<ChipListCell
						labels={types.map((type) => GRANT_TYPE_LABEL[type] ?? type)}
					/>
				);
			},
		}),
		createPresetColumn<TRow>("isFirstParty", {
			size: 130,
			cell: ({ getValue }) => {
				const isFirstParty = Boolean(getValue());
				return (
					<ChipCell
						label={isFirstParty ? "First-party" : "Third-party"}
						color={isFirstParty ? "primary" : "default"}
					/>
				);
			},
		}),
		createPresetColumn<TRow>("skipConsent", {
			size: 120,
			cell: ({ getValue }) => {
				const skipConsent = Boolean(getValue());
				return (
					<ChipCell
						label={skipConsent ? "동의 생략" : "동의 표시"}
						color={skipConsent ? "success" : "default"}
					/>
				);
			},
		}),
		createIsActiveColumn<TRow>({
			size: 80,
			cell: ({ getValue }) => {
				const isActive = Boolean(getValue());
				return (
					<ChipCell
						label={isActive ? "활성" : "비활성"}
						color={isActive ? "success" : "default"}
					/>
				);
			},
		}),
		createCreatedAtColumn<TRow>(),
		createActionsColumn<TRow>({
			size: 100,
			cell: ({ row }) => (
				<RowActionsCell
					id={row.original.id}
					basePath="/settings/auth/oidc-clients"
					showView
					showEdit={false}
					showDelete={false}
				/>
			),
		}),
	);
}

export const oidcClientTableColumns =
	buildOidcClientTableColumns<OidcClientDto>();

export function buildIdpAccountTableColumns<
	TRow extends {
		id: bigint;
		name: string;
		email: string;
		isActive: boolean;
		isPermanentlyLocked: boolean;
		lockedUntil?: Date | null;
		failedLoginAttempts: number;
		lastLoginAt?: Date | null;
	},
>({ onClickUnlockAccount }: { onClickUnlockAccount: (account: TRow) => void }) {
	/** IDP Account 목록 페이지용 컬럼 조합을 생성합니다. */
	return buildColumns<TRow>(
		createNameColumn<TRow>(),
		createEmailColumn<TRow>(),
		createIsActiveColumn<TRow>({
			size: 80,
			cell: ({ getValue }) => {
				const isActive = Boolean(getValue());
				return (
					<ChipCell
						label={isActive ? "활성" : "비활성"}
						color={isActive ? "success" : "default"}
					/>
				);
			},
		}),
		createPresetColumn<TRow>("isPermanentlyLocked", {
			size: 100,
			align: "center",
			cell: ({ row }) => {
				const config = getLockStatusConfig(row.original);
				return <ChipCell label={config.label} color={config.color} />;
			},
		}),
		createPresetColumn<TRow, TRow["failedLoginAttempts"]>(
			"failedLoginAttempts",
			{
				size: 80,
				align: "center",
				cell: ({ getValue }) => {
					const count = getValue();
					return (
						<DefaultCell
							value={count}
							tabular
							weight={count >= 5 ? "semibold" : "normal"}
							className={count >= 5 ? "text-danger" : undefined}
						/>
					);
				},
			},
		),
		createPresetColumn<TRow, TRow["lastLoginAt"]>("lastLoginAt", {
			size: 170,
			cell: ({ getValue }) => <DateTimeCell value={getValue()} />,
		}),
		createActionsColumn<TRow>({
			size: 180,
			cell: ({ row }) => {
				const account = row.original;
				const isLocked =
					account.isPermanentlyLocked || Boolean(account.lockedUntil);

				return (
					<ActionGroupCell>
						{isLocked ? (
							<ConfirmActionCell
								title="계정 잠금 해제"
								description="선택한 계정의 로그인 잠금을 해제합니다."
								confirmLabel="잠금 해제"
								triggerLabel="잠금 해제"
								status="accent"
								triggerColor="primary"
								onConfirm={() => onClickUnlockAccount(account)}
							/>
						) : null}
						<LinkCell
							href={`/settings/auth/accounts/${account.id}`}
							className="inline-flex h-8 items-center justify-center px-3 text-sm"
						>
							상세
						</LinkCell>
					</ActionGroupCell>
				);
			},
		}),
	);
}

export const idpAccountTableColumns =
	buildIdpAccountTableColumns<IdpAccountDto>({
		onClickUnlockAccount: () => undefined,
	});

export function buildEmailVerificationTableColumns<
	TRow extends {
		id: bigint;
		email: string;
		name: string;
		status: string;
		lastSendStatus?: string | null;
		sendCount: number;
		expiresAt: Date | null;
		verifiedAt?: Date | null;
		canResend: boolean;
		resendAvailableAt?: Date | null;
	},
>({
	onClickResendEmailVerification,
}: {
	onClickResendEmailVerification: (verification: TRow) => void;
}) {
	return buildColumns<TRow>(
		createEmailColumn<TRow>({
			size: 240,
			isRequired: true,
		}),
		createNameColumn<TRow>({
			size: 160,
		}),
		createPresetColumn<TRow, TRow["status"]>("status", {
			size: 120,
			align: "center",
			cell: ({ getValue }) => {
				const status = getValue();
				const config = Object.keys(EMAIL_VERIFICATION_STATUS_CONFIG).includes(status)
					? EMAIL_VERIFICATION_STATUS_CONFIG[
							status as keyof typeof EMAIL_VERIFICATION_STATUS_CONFIG
						]
					: {
							label: status,
							color: "default" as const,
						};

				return <ChipCell label={config.label} color={config.color} />;
			},
		}),
		createPresetColumn<TRow, TRow["lastSendStatus"]>("lastSendStatus", {
			size: 120,
			align: "center",
			cell: ({ getValue }) => {
				const status = getValue();
				if (!status) {
					return <DefaultCell value={null} />;
				}
				const config = Object.keys(EMAIL_SEND_STATUS_CONFIG).includes(status)
					? EMAIL_SEND_STATUS_CONFIG[
							status as keyof typeof EMAIL_SEND_STATUS_CONFIG
						]
					: {
							label: status,
							color: "default" as const,
						};

				return <ChipCell label={config.label} color={config.color} />;
			},
		}),
		createPresetColumn<TRow, TRow["sendCount"]>("sendCount", {
			size: 90,
			align: "center",
			cell: ({ getValue }) => <DefaultCell value={getValue()} tabular />,
		}),
		createPresetColumn<TRow, TRow["expiresAt"]>("expiresAt", {
			size: 180,
			cell: ({ getValue }) => <ExpiryCell expiresAt={getValue()} />,
		}),
		createPresetColumn<TRow, TRow["verifiedAt"]>("verifiedAt", {
			size: 170,
			cell: ({ getValue }) => <DateTimeCell value={getValue()} />,
		}),
		defineColumn<TRow>({
			field: "actions",
			label: "",
			size: 120,
			align: "center",
			cell: ({ row }) => {
				const verification = row.original;

				return (
					<ConfirmActionCell
						title="인증 메일 재발송"
						description="선택한 이메일 인증 요청의 메일을 다시 발송합니다."
						confirmLabel="재발송"
						triggerLabel="재발송"
						status="accent"
						triggerColor="primary"
						startContent={<Send className="size-4" />}
						isDisabled={!verification.canResend}
						onConfirm={() => onClickResendEmailVerification(verification)}
					/>
				);
			},
		}),
	);
}

export const emailVerificationTableColumns =
	buildEmailVerificationTableColumns<EmailVerificationDto>({
		onClickResendEmailVerification: () => undefined,
	});

export const authAuditLogCreatedAtColumn =
	createCreatedAtColumn<AuthAuditLogDto>({
		fieldKey: "occurredAt",
		accessorKey: "createdAt",
		size: 170,
		isRequired: true,
	});

export const authAuditLogEmailColumn = createEmailColumn<AuthAuditLogDto>();

/** 인증 감사 로그 결과를 Chip으로 보여주는 컬럼입니다. */
export const authAuditLogResultColumn = createPresetColumn<
	AuthAuditLogDto,
	AuthAuditLogDto["result"]
>("result", {
	size: 100,
	align: "center",
	cell: ({ getValue }) => {
		const config = getAuditResultConfig(getValue());
		return <ChipCell label={config.label} color={config.color} />;
	},
});

export const authAuditLogFailureReasonColumn =
	createPresetColumn<AuthAuditLogDto>("failureReason", {
		size: 200,
	});

export const authAuditLogIpAddressColumn = createPresetColumn<AuthAuditLogDto>(
	"ipAddress",
	{
		size: 140,
	},
);

export const authAuditLogUserAgentColumn = createPresetColumn<AuthAuditLogDto>(
	"userAgent",
	{
		size: 250,
	},
);

export const authAuditLogTableColumns = buildColumns<AuthAuditLogDto>(
	authAuditLogCreatedAtColumn,
	authAuditLogEmailColumn,
	authAuditLogResultColumn,
	authAuditLogFailureReasonColumn,
	authAuditLogIpAddressColumn,
	authAuditLogUserAgentColumn,
);

export function buildAuthAuditLogTableColumns<
	TRow extends {
		createdAt: Date;
		email: string;
		result: string;
		failureReason?: string | null;
		ipAddress: string;
		userAgent?: string | null;
	},
>() {
	return buildColumns<TRow>(
		createCreatedAtColumn<TRow>({
			fieldKey: "occurredAt",
			accessorKey: "createdAt",
			size: 170,
			isRequired: true,
		}),
		createEmailColumn<TRow>(),
		createPresetColumn<TRow, TRow["result"]>("result", {
			size: 100,
			align: "center",
			cell: ({ getValue }) => {
				const config = getAuditResultConfig(getValue());
				return <ChipCell label={config.label} color={config.color} />;
			},
		}),
		createPresetColumn<TRow>("failureReason", {
			size: 200,
		}),
		createPresetColumn<TRow>("ipAddress", {
			size: 140,
		}),
		createPresetColumn<TRow>("userAgent", {
			size: 250,
		}),
	);
}

export function buildOidcSessionTableColumns<
	TRow extends {
		id: bigint;
		key: string;
		modelType: string;
		accountId?: string;
		grantId?: string;
		expiresAt: Date | null;
		createdAt: Date;
	},
>({
	onClickGrantId,
	onClickRevokeSession,
}: {
	onClickGrantId: (grantId: string) => void;
	onClickRevokeSession: (key: string) => void;
}) {
	/** OIDC Session 목록 페이지용 컬럼 조합을 생성합니다. */
	return buildColumnsWithDefaultCreatedAt<TRow>(
		[
			createPresetColumn<TRow, TRow["key"]>("key", {
				size: 140,
				isRequired: true,
				/** 긴 세션 키는 앞부분만 노출하고 전체 값은 title로 보존합니다. */
				cell: ({ getValue }) => {
					const key = getValue();
					return (
						<DefaultCell value={`${key.slice(0, 8)}...`} mono title={key} />
					);
				},
			}),
			createPresetColumn<TRow, TRow["modelType"]>("modelType", {
				size: 140,
				cell: ({ getValue }) => {
					const config = getModelTypeConfig(getValue());
					return <ChipCell label={config.label} color={config.color} />;
				},
			}),
			createPresetColumn<TRow, TRow["accountId"]>("accountId", {
				size: 140,
				/** accountId도 동일한 방식으로 축약 표시합니다. */
				cell: ({ getValue }) => {
					const accountId = getValue();

					return (
						<DefaultCell
							value={accountId ? `${accountId.slice(0, 8)}...` : null}
							mono
							title={accountId ?? undefined}
						/>
					);
				},
			}),
			createPresetColumn<TRow, TRow["grantId"]>("grantId", {
				size: 140,
				/** grantId는 클릭 액션이 있으므로 버튼 형태의 셀로 표시합니다. */
				cell: ({ getValue }) => {
					const grantId = getValue();
					if (!grantId) {
						return <DefaultCell value={null} />;
					}

					return (
						<ConfirmActionCell
							title="Grant 세션/토큰 폐기"
							description="선택한 Grant의 모든 세션/토큰을 폐기합니다."
							confirmLabel="폐기"
							triggerLabel={`${grantId.slice(0, 8)}...`}
							triggerVariant="light"
							triggerColor="default"
							className="font-mono text-sm"
							tooltip={`${grantId}\n클릭하면 이 Grant의 모든 세션/토큰을 일괄 폐기합니다.`}
							onConfirm={() => onClickGrantId(grantId)}
						/>
					);
				},
			}),
			createPresetColumn<TRow, TRow["expiresAt"]>("expiresAt", {
				size: 180,
				cell: ({ getValue }) => <ExpiryCell expiresAt={getValue()} />,
			}),
		],
		[
			createActionsColumn<TRow>({
				size: 100,
				cell: ({ row }) => (
					<ConfirmActionCell
						title="세션/토큰 폐기"
						description="선택한 OIDC 세션/토큰을 폐기합니다."
						confirmLabel="폐기"
						triggerLabel="폐기"
						triggerColor="danger"
						startContent={<Ban className="h-3 w-3" />}
						onConfirm={() => onClickRevokeSession(row.original.key)}
					/>
				),
			}),
		],
	);
}

export const oidcSessionTableColumns =
	buildOidcSessionTableColumns<OidcSessionDto>({
		onClickGrantId: () => undefined,
		onClickRevokeSession: () => undefined,
	});
