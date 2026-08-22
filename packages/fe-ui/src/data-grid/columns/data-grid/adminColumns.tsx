"use client";

import type { AssetDto } from "@cocrepo/api/assets";
import type { AbilityResponseDto } from "@cocrepo/api/core/abilities";
import type { ActionDto } from "@cocrepo/api/core/actions";
import type { InquiryDto } from "@cocrepo/api/core/inquiries";
import type { RoleDto } from "@cocrepo/api/core/roles";
import type { SubjectDto } from "@cocrepo/api/core/subjects";
import type { TaskDto } from "@cocrepo/api/core/tasks";
import type { TimelineDto } from "@cocrepo/api/core/timelines";
import { AlertDialog } from "@heroui/react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { MouseEvent } from "react";
import { Button } from "../../../input/Button/Button";
import {
	ActionButtonCell,
	BooleanCell,
	ChipCell,
	DateTimeCell,
	DefaultCell,
	LinkCell,
	NameCell,
	PhoneCell,
	ProfileAvatarCell,
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
import { COLUMN_FIELDS } from "./fieldPresets";

type RoleLike = {
	name?: string;
	displayName?: string;
};

function DeleteAlertActionCell({
	title,
	description,
	onConfirm,
}: {
	title: string;
	description: string;
	onConfirm: () => void | Promise<void>;
}) {
	return (
		<AlertDialog>
			<AlertDialog.Trigger>
				<ActionButtonCell variant="danger-soft">
					삭제
				</ActionButtonCell>
			</AlertDialog.Trigger>
			<AlertDialog.Backdrop>
				<AlertDialog.Container size="sm">
					<AlertDialog.Dialog>
						<AlertDialog.Header>
							<AlertDialog.Icon status="danger" />
							<AlertDialog.Heading>{title}</AlertDialog.Heading>
						</AlertDialog.Header>
						<AlertDialog.Body>{description}</AlertDialog.Body>
						<AlertDialog.Footer>
							<Button variant="ghost">
								취소
							</Button>
							<Button variant="danger" onPress={onConfirm}>
								삭제
							</Button>
						</AlertDialog.Footer>
					</AlertDialog.Dialog>
				</AlertDialog.Container>
			</AlertDialog.Backdrop>
		</AlertDialog>
	);
}

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
  id: string;
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
	accessorKey: COLUMN_FIELDS.name,
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
	cell: ({ getValue }) => {
		const group = getValue() as string | undefined;
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
		id: string;
		name: string;
		displayName?: string | null;
		group?: string | null;
		createdAt: string | Date | null;
		removedAt?: string | null;
	},
>(options: { onClickDetailButton?: (row: TRow) => void } = {}) {
	const columns = buildColumns<TRow>(
		createNameColumn<TRow>({
			fieldKey: "actionKey",
			accessorKey: COLUMN_FIELDS.name,
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
			cell: ({ getValue }) => {
				const group = getValue() as string | undefined;
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
		id: string;
		name: string;
		email?: string | null;
		phone?: string | null;
		removedAt?: string | null;
		createdAt: string;
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
			cell: ({ getValue }) => (
				<PhoneCell
					value={getValue() as string | null}
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
			accessorKey: COLUMN_FIELDS.createdAt,
		}),
	);
}

export const subjectNameColumn = createNameColumn<SubjectDto>({
	fieldKey: "subjectKey",
	accessorKey: COLUMN_FIELDS.name,
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
		createdAt: string | Date | null;
		removedAt?: string | null;
	},
>() {
	return buildColumns<TRow>(
		createDisplayNameColumn<TRow>({
			label: "대상",
			size: 220,
			isRequired: true,
			cell: ({ row }) => (
				<div className="flex flex-col">
					<span className="font-medium text-foreground">
						{getSubjectDisplayLabel(row.original)}
					</span>
					<span className="text-xs text-muted">
						{getSubjectGroupLabel(row.original.group)} 권한 대상
					</span>
				</div>
			),
		}),
		createGroupColumn<TRow>({
			label: "유형",
			size: 120,
			align: "center",
			cell: ({ getValue }) => {
				const group = getValue() as string | undefined;
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
	accessorKey: COLUMN_FIELDS.name,
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
		<Link className="inline-flex h-8 items-center justify-center px-3 text-sm" href={`/roles/${row.original.id}`}>
			상세
		</Link>
	),
});

/** 역할 목록 페이지용 컬럼 조합을 생성합니다. */
export function buildAdminRoleTableColumns<
	TRow extends {
		id: string;
		name: string;
		displayName?: string | null;
		description?: string | null;
		createdAt: string | Date | null;
		removedAt?: string | null;
	},
>() {
	return buildColumnsWithDefaultCreatedAt<TRow>(
		[
			createNameColumn<TRow>({
				fieldKey: "roleKey",
				accessorKey: COLUMN_FIELDS.name,
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
					<Link className="inline-flex h-8 items-center justify-center px-3 text-sm" href={`/roles/${row.original.id}`}>
						상세
					</Link>
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
			cell: ({ row }) => {
				const ability = row.original;
				return (
					<div className="flex min-w-0 flex-col gap-1">
						<div className="flex items-center gap-2">
							<ChipCell
								label={ability.inverted ? "거부" : "허용"}
								color={ability.inverted ? "danger" : "success"}
								align="start"
							/>
							<DefaultCell
								value={ability.name}
								weight="semibold"
								lineClamp={1}
							/>
						</div>
						{ability.description ? (
							<DefaultCell
								value={ability.description}
								tone="muted"
								size="xs"
								lineClamp={1}
							/>
						) : null}
					</div>
				);
			},
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

export function buildTaskTableColumns<TRow extends TaskDto = TaskDto>({
	onClickTaskName,
	onClickDeleteButton,
}: {
	onClickTaskName: (taskId: string) => void;
	onClickDeleteButton: (taskId: string) => void;
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
			createPresetColumn<TRow>("duration", {
				accessorKey: "exercise.duration",
				size: 100,
				align: "center",
				cell: ({ getValue }) => (
					<DefaultCell value={formatDuration(getValue() as number)} />
				),
			}),
			createPresetColumn<TRow>("count", {
				accessorKey: "exercise.count",
				size: 80,
				align: "center",
				cell: ({ getValue }) => (
					<DefaultCell value={`${getValue() as number}회`} />
				),
			}),
			createDescriptionColumn<TRow>({
				accessorKey: "exercise.description",
				cell: ({ getValue }) => (
					<DefaultCell
						value={getValue() as string | undefined}
						tone="muted"
						lineClamp={2}
					/>
				),
			}),
		],
		[
			createActionsColumn<TRow>({
				cell: ({ row }) => (
					<DeleteAlertActionCell
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
	onClickDeleteButton: (timelineId: string) => void;
}) {
	/** Timeline 목록 페이지용 컬럼 조합을 생성합니다. */
	return buildColumnsWithDefaultCreatedAt<TRow>(
		[
			createNameColumn<TRow>({
				nameVariant: "plain",
				cell: ({ getValue, row }) => (
					<Link
						href={`/timelines/${row.original.id}` as Route}
						className="text-accent hover:underline"
						onClick={(event: MouseEvent<HTMLAnchorElement>) => {
							event.stopPropagation();
						}}
					>
						{getValue() as string}
					</Link>
				),
			}),
			createDescriptionColumn<TRow>({
				size: 300,
				cell: ({ getValue }) => (
					<DefaultCell
						value={getValue() as string}
						tone="muted"
						lineClamp={1}
					/>
				),
			}),
		],
		[
			createActionsColumn<TRow>({
				cell: ({ row }) => (
					<DeleteAlertActionCell
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
		id: string;
		code: string;
		name: string;
		isActive: boolean;
		createdAt: string | Date | null;
	},
>({
	onClickTemplateCode,
	onToggleTemplateStatusSwitch,
}: {
	onClickTemplateCode: (templateId: string) => void;
	onToggleTemplateStatusSwitch: (templateId: string) => Promise<void>;
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
  onClickSpaceFitnessCenterName: (spaceId: string) => void;
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
			cell: ({ getValue }) => (
				<ChipCell label={getValue() as string | null} color="secondary" />
			),
		}),
		defineColumn<TRow>({
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
		id: string;
		name: string;
		label?: string | null;
		createdAt: string | Date | null;
	},
>({
	onClickRoutineName,
	onClickDeleteButton,
}: {
	onClickRoutineName: (routineId: string) => void;
	onClickDeleteButton: (routineId: string) => void;
}) {
	/** Routine 목록 페이지용 컬럼 조합을 생성합니다. */
	return buildColumnsWithDefaultCreatedAt<TRow>(
		[
			createNameColumn<TRow>({
				nameVariant: "clickable",
				onClickName: (row) => onClickRoutineName(row.id),
			}),
			createLabelColumn<TRow>({
				cell: ({ getValue }) => (
					<DefaultCell value={getValue() as string} tone="muted" />
				),
			}),
		],
		[
			createActionsColumn<TRow>({
				cell: ({ row }) => (
					<DeleteAlertActionCell
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
		createdAt: string;
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
						<Link
							href={`/assets/${row.original.id}`}
							className="text-accent hover:underline"
						>
							{row.original.originalName}
						</Link>
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
			createPresetColumn<TRow>("mimeType", {
				size: 180,
				cell: ({ getValue }) => (
					<DefaultCell value={getValue() as string} mono size="xs" />
				),
			}),
			createPresetColumn<TRow>("sizeBytes", {
				size: 120,
				align: "right",
				cell: ({ getValue }) => (
					<DefaultCell value={formatAssetBytes(getValue() as number)} />
				),
			}),
		],
		[
			createActionsColumn<TRow>({
				size: mode === "picker" ? 220 : 220,
				align: "center",
				cell: ({ row }) => {
					if (mode === "picker") {
						const isSelected = row.original.id === selectedAssetId;

						return (
							<div className="flex items-center justify-center gap-2">
								{onClickSelectAssetButton ? (
									<Button
										size="sm"
										variant={isSelected ? "primary" : "ghost"}
										onPress={() => onClickSelectAssetButton(row.original)}
									>
										{isSelected ? "선택됨" : "선택"}
									</Button>
								) : null}
								<Button
									size="sm"
									variant="danger-soft"
									isDisabled={isRemoving}
									onPress={() => onClickDeleteAssetButton(row.original.id)}
								>
									삭제
								</Button>
							</div>
						);
					}

					return (
						<div className="flex items-center justify-center gap-2">
							{onClickPreviewAssetButton ? (
								<Button
									size="sm"
									variant="ghost"
									onPress={() => onClickPreviewAssetButton(row.original)}
								>
									<Eye className="h-4 w-4" aria-hidden />
									보기
								</Button>
							) : null}
							<Button
								size="sm"
								variant="danger-soft"
								isDisabled={isRemoving}
								onPress={() => onClickDeleteAssetButton(row.original.id)}
							>
								삭제
							</Button>
						</div>
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
		createPresetColumn<TRow>("title", {
			size: 260,
			isRequired: true,
			cell: ({ getValue }) => (
				<DefaultCell value={getValue() as string} lineClamp={2} />
			),
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
			accessorKey: COLUMN_FIELDS.createdAt,
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
		updatedAt: string | Date | null;
	},
>(options: {
	onClickEditButton: (translation: TRow) => void;
	onClickDeleteButton: (translation: TRow) => void;
}) {
	return buildColumns<TRow>(
		defineColumn<TRow>({
			field: "languageCode",
			label: "언어",
			size: 110,
			align: "center",
			cell: ({ getValue }) => (
				<ChipCell
					label={getStaticTranslationLanguageLabel(getValue() as string)}
				/>
			),
		}),
		defineColumn<TRow>({
			field: "key",
			label: "번역 키",
			size: 260,
			isRequired: true,
			cell: ({ getValue }) => (
				<DefaultCell value={getValue() as string} mono truncate />
			),
		}),
		defineColumn<TRow>({
			field: "category",
			label: "카테고리",
			size: 130,
			align: "center",
			cell: ({ getValue }) => {
				const category = getValue() as string;
				return (
					<ChipCell
						label={category}
						color={getStaticTranslationCategoryColor(category)}
					/>
				);
			},
		}),
		defineColumn<TRow>({
			field: "text",
			label: "번역문",
			size: 420,
			isRequired: true,
			cell: ({ getValue }) => (
				<DefaultCell value={getValue() as string} lineClamp={2} />
			),
		}),
		defineColumn<TRow>({
			field: "isTranslated",
			label: "완료",
			size: 100,
			align: "center",
			cell: ({ getValue }) => (
				<BooleanCell
					value={getValue() as boolean}
					trueLabel="완료"
					falseLabel="대기"
					trueColor="success"
					falseColor="warning"
				/>
			),
		}),
		defineColumn<TRow>({
			field: "updatedAt",
			label: "수정일",
			size: 150,
			cell: ({ getValue }) => <DateTimeCell value={getValue() as string} />,
		}),
		createActionsColumn<TRow>({
			label: "관리",
			size: 120,
			cell: ({ row }) => (
				<div className="flex justify-center gap-1">
					<Button
						isIconOnly
						size="sm"
						variant="ghost"
						aria-label="번역 수정"
						onPress={() => {
							options.onClickEditButton(row.original);
						}}
					>
						<Pencil className="h-4 w-4" />
					</Button>
					<Button
						isIconOnly
						size="sm"
						variant="danger-soft"
						aria-label="번역 삭제"
						onPress={() => {
							options.onClickDeleteButton(row.original);
						}}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			),
		}),
	);
}
