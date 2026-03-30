"use client";

import type { AssetDto } from "@cocrepo/api/assets";
import type { ActionDto } from "@cocrepo/api/core/actions";
import type { RoleDto } from "@cocrepo/api/core/roles";
import type { SubjectDto } from "@cocrepo/api/core/subjects";
import {
	ActionButtonCell,
	BooleanCell,
	ChipCell,
	DefaultCell,
	InquiryAssigneeCell,
	InquiryCategoryCell,
	InquiryChannelCell,
	InquiryPriorityCell,
	InquirySentimentCell,
	InquirySLACell,
	InquiryStatusCell,
	InquiryUnreadCell,
	LinkCell,
	PhoneCell,
	ProfileAvatarCell,
	RoleNameCell,
	StatusChipCell,
	TemplateActiveToggleCell,
	UserRoleCell,
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
	formatAssetBytes,
	formatDuration,
	getActionGroupColor,
	getAssetKindLabel,
	getAssetStatusColor,
	getAssetStatusLabel,
} from "../internal/masterFactory";
import { COLUMN_FIELDS } from "../internal/fieldPresets";
import Link from "next/link";

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

/** 시스템 액션 여부를 한글 BooleanCell로 보여주는 컬럼입니다. */
export const actionIsSystemColumn = createPresetColumn<ActionDto>("isSystem", {
	size: 100,
	align: "center",
	cell: ({ getValue }) => (
		<BooleanCell
			value={getValue() as boolean}
			trueLabel="시스템"
			falseLabel="사용자"
			trueColor="warning"
			falseColor="default"
		/>
	),
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
		name: string;
		displayName?: string | null;
		group?: string | null;
		order: number;
		isSystem: boolean;
		createdAt: string | Date | null;
		removedAt?: string | null;
	},
>() {
	return buildColumns<TRow>(
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
						label={group}
						color={group ? getActionGroupColor(group) : undefined}
					/>
				);
			},
		}),
		createPresetColumn<TRow>("order", {
			size: 80,
			align: "center",
		}),
		createPresetColumn<TRow>("isSystem", {
			size: 100,
			align: "center",
			cell: ({ getValue }) => (
				<BooleanCell
					value={getValue() as boolean}
					trueLabel="시스템"
					falseLabel="사용자"
					trueColor="warning"
					falseColor="default"
				/>
			),
		}),
		createCreatedAtColumn<TRow>({
			size: 150,
		}),
		createRemovedAtStatusColumn<TRow>({
			size: 100,
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
		tenants?: Parameters<typeof UserRoleCell>[0]["tenants"];
	},
>() {
	/** 사용자 목록 페이지용 컬럼 조합을 생성합니다. */
	return buildColumns<TRow>(
		createNameColumn<TRow>(),
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
			cell: ({ row }) => <UserRoleCell tenants={row.original.tenants} />,
		}),
		createStatusColumn<TRow>({
			size: 100,
			cell: ({ row }) => <StatusChipCell removedAt={row.original.removedAt} />,
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
		createNameColumn<TRow>({
			fieldKey: "subjectKey",
			accessorKey: COLUMN_FIELDS.name,
			size: 220,
			isRequired: true,
			nameVariant: "identifier",
		}),
		createDisplayNameColumn<TRow>(),
		createGroupColumn<TRow>(),
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
	cell: ({ row }) => (
		<RoleNameCell value={row.original.name} isSystem={row.original.isSystem} />
	),
});

export const adminRoleDisplayNameColumn = createDisplayNameColumn<RoleDto>();

export const adminRoleDescriptionColumn = createDescriptionColumn<RoleDto>();

export const adminRoleStatusColumn = createRemovedAtStatusColumn<RoleDto>({
	size: 100,
});

export const adminRoleActionsColumn = createActionsColumn<RoleDto>({
	size: 100,
	cell: ({ row }) => (
		<ActionButtonCell
			as={Link}
			href={`/roles/${row.original.id}`}
			variant="flat"
		>
			상세
		</ActionButtonCell>
	),
});

/** 역할 목록 페이지용 컬럼 조합을 생성합니다. */
export function buildAdminRoleTableColumns<
	TRow extends {
		id: string;
		name: string;
		displayName?: string | null;
		description?: string | null;
		isSystem: boolean;
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
				cell: ({ row }) => (
					<RoleNameCell
						value={row.original.name}
						isSystem={row.original.isSystem}
					/>
				),
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
					<ActionButtonCell
						as={Link}
						href={`/roles/${row.original.id}`}
						variant="flat"
					>
						상세
					</ActionButtonCell>
				),
			}),
		],
	);
}

/** 역할 목록 페이지에서 사용하는 전체 컬럼 조합입니다. */
export const adminRoleTableColumns = buildAdminRoleTableColumns<RoleDto>();

/** 권한 목록 페이지용 컬럼 조합을 생성합니다. */
export function buildAbilityListTableColumns<
	TRow extends {
		id: string;
		name: string;
		subjectLabel: string;
		actionLabel: string;
		inverted: boolean;
		fieldCount: number;
		hasConditions: boolean;
		createdAt: string | Date | null;
	},
>() {
	return buildColumnsWithDefaultCreatedAt<TRow>([
		createNameColumn<TRow>({
			size: 180,
			nameVariant: "identifier",
		}),
		createPresetColumn<TRow>("subjectLabel", {
			size: 150,
			cell: ({ getValue }) => (
				<DefaultCell value={getValue() as string | null} placeholder="-" />
			),
		}),
		createPresetColumn<TRow>("actionLabel", {
			size: 120,
			cell: ({ getValue }) => (
				<DefaultCell value={getValue() as string | null} placeholder="-" />
			),
		}),
		createPresetColumn<TRow>("inverted", {
			size: 100,
			align: "center",
			cell: ({ getValue }) => (
				<BooleanCell
					value={getValue() as boolean}
					trueLabel="거부(cannot)"
					falseLabel="허용(can)"
					trueColor="danger"
					falseColor="success"
				/>
			),
		}),
		createPresetColumn<TRow>("fieldCount", {
			size: 80,
			align: "center",
			cell: ({ getValue }) => {
				const fieldCount = getValue() as number;
				return <DefaultCell value={fieldCount === 0 ? "전체" : fieldCount} />;
			},
		}),
		createPresetColumn<TRow>("hasConditions", {
			size: 80,
			align: "center",
			cell: ({ getValue }) => (
				<BooleanCell
					value={getValue() as boolean}
					trueLabel="있음"
					falseLabel="없음"
					trueColor="primary"
					falseColor="default"
				/>
			),
		}),
	]);
}

export function buildTaskTableColumns<
	TRow extends {
		id: string;
		name: string;
		isSchedulable: boolean;
		duration: number;
		count: number;
		description?: string;
		createdAt: string;
	},
>({
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
				onClickName: (row) => onClickTaskName(row.id),
			}),
			createPresetColumn<TRow>("isSchedulable", {
				size: 110,
				align: "center",
				cell: ({ getValue }) => (
					<BooleanCell
						value={getValue() as boolean}
						trueLabel="가능"
						falseLabel="불가"
						trueColor="success"
						falseColor="warning"
					/>
				),
			}),
			createPresetColumn<TRow>("duration", {
				size: 100,
				align: "center",
				cell: ({ getValue }) => (
					<DefaultCell value={formatDuration(getValue() as number)} />
				),
			}),
			createPresetColumn<TRow>("count", {
				size: 80,
				align: "center",
				cell: ({ getValue }) => (
					<DefaultCell value={`${getValue() as number}회`} />
				),
			}),
			createDescriptionColumn<TRow>({
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
					<ActionButtonCell
						color="danger"
						variant="light"
						onPress={() => onClickDeleteButton(row.original.id)}
					>
						삭제
					</ActionButtonCell>
				),
			}),
		],
	);
}

export function buildTimelineTableColumns<
	TRow extends {
		id: string;
		name: string;
		description?: string | null;
		createdAt: string | Date | null;
	},
>({
	onClickTimelineName,
	onClickDeleteButton,
}: {
	onClickTimelineName: (timelineId: string) => void;
	onClickDeleteButton: (timelineId: string) => void;
}) {
	/** Timeline 목록 페이지용 컬럼 조합을 생성합니다. */
	return buildColumnsWithDefaultCreatedAt<TRow>(
		[
			createNameColumn<TRow>({
				nameVariant: "clickable",
				onClickName: (row) => onClickTimelineName(row.id),
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
					<ActionButtonCell
						color="danger"
						variant="light"
						onPress={() => onClickDeleteButton(row.original.id)}
					>
						삭제
					</ActionButtonCell>
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
					variant="light"
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
				<TemplateActiveToggleCell
					isActive={row.original.isActive}
					templateId={row.original.id}
					onToggle={onToggleTemplateStatusSwitch}
				/>
			),
		}),
		createCreatedAtColumn<TRow>({
			size: 160,
		}),
	);
}

export function buildSpaceTableColumns<
	TRow extends {
		id: string;
		createdAt: string;
		name: string;
		label: string | null;
		businessNo: string;
		address: string;
		phone: string;
		email: string;
	},
>({
	onClickSpaceGroundName,
}: {
	onClickSpaceGroundName: (spaceId: string) => void;
}) {
	/** Space 목록 페이지용 컬럼 조합을 생성합니다. */
	return buildColumnsWithDefaultCreatedAt<TRow>([
		createNameColumn<TRow>({
			nameVariant: "clickable",
			onClickName: (row) => onClickSpaceGroundName(row.id),
		}),
		createLabelColumn<TRow>({
			size: 120,
			align: "center",
			cell: ({ getValue }) => (
				<ChipCell label={getValue() as string | null} color="secondary" />
			),
		}),
		createPresetColumn<TRow>("businessNo", {
			size: 160,
		}),
		createPresetColumn<TRow>("address", {
			size: 250,
		}),
		createPhoneColumn<TRow>(),
		createEmailColumn<TRow>(),
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
					<ActionButtonCell
						color="danger"
						variant="light"
						onPress={() => onClickDeleteButton(row.original.id)}
					>
						삭제
					</ActionButtonCell>
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
}: {
	isRemoving: boolean;
	onClickDeleteAssetButton: (assetId: string) => void;
}) {
	/** Asset 목록 페이지용 컬럼 조합을 생성합니다. */
	return buildColumnsWithDefaultCreatedAt<TRow>(
		[
			createPresetColumn<TRow>("originalName", {
				size: 280,
				isRequired: true,
				cell: ({ row }) => (
					<LinkCell
						href={`/assets/${row.original.id}`}
						className="text-primary hover:underline"
						value={row.original.originalName}
					/>
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
				size: 100,
				align: "center",
				cell: ({ row }) => (
					<ActionButtonCell
						variant="flat"
						color="danger"
						isLoading={isRemoving}
						onPress={() => onClickDeleteAssetButton(row.original.id)}
					>
						삭제
					</ActionButtonCell>
				),
			}),
		],
	);
}

export const assetTableColumns = buildAssetTableColumns<AssetDto>({
	isRemoving: false,
	onClickDeleteAssetButton: () => undefined,
});

export function buildInquiryTableColumns<
	TRow extends {
		id: string;
		title: string;
		customerId: string;
		customerName: string;
		status: Parameters<typeof InquiryStatusCell>[0]["value"];
		category: Parameters<typeof InquiryCategoryCell>[0]["value"];
		channel: Parameters<typeof InquiryChannelCell>[0]["value"];
		priority: Parameters<typeof InquiryPriorityCell>[0]["value"];
		assigneeId?: string;
		assigneeName?: string;
		sentiment?: Parameters<typeof InquirySentimentCell>[0]["value"];
		slaStatus?: Parameters<typeof InquirySLACell>[0]["status"];
		slaRemainingMinutes?: number;
		unreadCount: number;
		createdAt: string;
		updatedAt: string;
	},
>() {
	/** Inquiry 목록 페이지용 컬럼 조합을 생성합니다. */
	return buildColumns<TRow>(
		createPresetColumn<TRow>("customerName", {
			size: 180,
			isRequired: true,
			cell: ({ row }) => (
				<ProfileAvatarCell
					name={row.original.customerName}
					subtitle={row.original.customerId}
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
			cell: ({ getValue }) => (
				<InquiryStatusCell
					value={getValue() as Parameters<typeof InquiryStatusCell>[0]["value"]}
				/>
			),
		}),
		createPresetColumn<TRow>("category", {
			size: 140,
			align: "center",
			cell: ({ getValue }) => (
				<InquiryCategoryCell
					value={
						getValue() as Parameters<typeof InquiryCategoryCell>[0]["value"]
					}
				/>
			),
		}),
		createPresetColumn<TRow>("channel", {
			size: 120,
			align: "center",
			cell: ({ getValue }) => (
				<InquiryChannelCell
					value={
						getValue() as Parameters<typeof InquiryChannelCell>[0]["value"]
					}
				/>
			),
		}),
		createPresetColumn<TRow>("priority", {
			size: 130,
			align: "center",
			cell: ({ getValue }) => (
				<InquiryPriorityCell
					value={
						getValue() as Parameters<typeof InquiryPriorityCell>[0]["value"]
					}
				/>
			),
		}),
		createPresetColumn<TRow>("assigneeName", {
			size: 150,
			align: "center",
			cell: ({ row }) => (
				<InquiryAssigneeCell name={row.original.assigneeName} />
			),
		}),
		createPresetColumn<TRow>("sentiment", {
			size: 100,
			align: "center",
			cell: ({ getValue }) => (
				<InquirySentimentCell
					value={
						getValue() as Parameters<typeof InquirySentimentCell>[0]["value"]
					}
				/>
			),
		}),
		createPresetColumn<TRow>("slaStatus", {
			size: 120,
			align: "center",
			cell: ({ row }) => (
				<InquirySLACell
					status={row.original.slaStatus}
					remainingMinutes={row.original.slaRemainingMinutes}
				/>
			),
		}),
		createPresetColumn<TRow>("unreadCount", {
			size: 100,
			align: "center",
			cell: ({ getValue }) => (
				<InquiryUnreadCell count={getValue() as number} />
			),
		}),
		createCreatedAtColumn<TRow>({
			fieldKey: "receivedAt",
			accessorKey: COLUMN_FIELDS.createdAt,
			size: 160,
		}),
	);
}
