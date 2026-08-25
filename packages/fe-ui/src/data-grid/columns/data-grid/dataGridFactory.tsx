"use client";

import type { AssetKind, AssetStatus } from "@cocrepo/api/assets";
import type { DataGridColumnConfig } from "@cocrepo/type";
import {
	ChipCell,
	DateTimeCell,
	DefaultCell,
	NameCell,
	PhoneCell,
} from "../../cell";

const COLUMN_LABELS = {
	name: "이름",
	actionKey: "행위 식별자",
	subjectKey: "Subject 식별자",
	roleKey: "역할 식별자",
	displayName: "표시명",
	group: "분류",
	label: "라벨",
	email: "이메일",
	phone: "전화번호",
	description: "설명",
	createdAt: "등록일",
	signedUpAt: "가입일",
	receivedAt: "접수일",
	occurredAt: "시간",
	status: "상태",
	isActive: "활성",
	actions: "",
	role: "역할",
	order: "순서",
	duration: "지속시간",
	count: "반복횟수",
	isSchedulable: "스케줄 가능",
	code: "템플릿 코드",
	businessNo: "사업자등록번호",
	address: "주소",
	originalName: "파일명",
	kind: "타입",
	mimeType: "MIME",
	sizeBytes: "크기",
	customerName: "고객",
	title: "제목",
	category: "카테고리",
	channel: "채널",
	priority: "우선순위",
	assigneeName: "담당자",
	sentiment: "감성",
	slaStatus: "SLA",
	unreadCount: "미확인",
	clientId: "Client ID",
	tokenEndpointAuthMethod: "인증 방식",
	grantTypes: "Grant Types",
	isFirstParty: "신뢰 구분",
	skipConsent: "Consent",
	isPermanentlyLocked: "잠금 상태",
	failedLoginAttempts: "실패 횟수",
	lastLoginAt: "최종 로그인",
	lastSendStatus: "발송 상태",
	lastSentAt: "마지막 발송",
	resendAvailableAt: "재발송 가능",
	result: "결과",
	sendCount: "발송 횟수",
	failureReason: "실패 사유",
	ipAddress: "IP 주소",
	userAgent: "User Agent",
	key: "키",
	modelType: "모델 타입",
	accountId: "Account ID",
	grantId: "Grant ID",
	expiresAt: "만료 시간",
	verifiedAt: "인증 시각",
	subjectLabel: "Subject",
	actionLabel: "Action",
	inverted: "유형",
	fieldCount: "필드 수",
	hasConditions: "조건",
} as const;

type PresetColumnKey = keyof typeof COLUMN_LABELS;

export type ColumnOverrides<TData, TValue = unknown> = Partial<
	Omit<DataGridColumnConfig<TData, TValue>, "field">
> & {
	accessorKey?: keyof TData | string;
};

type NameColumnOverrides<TData> = ColumnOverrides<TData> & {
	fieldKey?: "name" | "actionKey" | "subjectKey" | "roleKey";
	accessorKey?: keyof TData | string;
	nameVariant?: "plain" | "identifier" | "clickable";
	onClickName?: (row: TData) => void;
};

type CreatedAtColumnOverrides<TData> = ColumnOverrides<TData> & {
	fieldKey?: "createdAt" | "signedUpAt" | "receivedAt" | "occurredAt";
	accessorKey?: keyof TData | string;
};

/** DataGrid 컬럼 객체를 그대로 반환해 제네릭 정보를 보존합니다. */
export function defineColumn<TData, TValue = unknown>(
	column: DataGridColumnConfig<TData, TValue>,
) {
	return column;
}

/** 호출부에서 컬럼 순서를 명시적으로 유지하도록 tuple 형태로 묶습니다. */
export function buildColumns<TData>(
	...columns: DataGridColumnConfig<TData, unknown>[]
) {
	return columns;
}

/** 목록 화면에서 자주 쓰는 createdAt 후행 컬럼을 공통 규칙으로 붙입니다. */
export function buildColumnsWithDefaultCreatedAt<TData>(
	leading: DataGridColumnConfig<TData, unknown>[],
	trailing: DataGridColumnConfig<TData, unknown>[] = [],
) {
	return buildColumns<TData>(
		...leading,
		createCreatedAtColumn<TData>(),
		...trailing,
	);
}

/** preset fieldKey를 실제 DataGrid 컬럼 정의로 해석합니다. */
export function createPresetColumn<TData, TValue = unknown>(
	fieldKey: PresetColumnKey,
	overrides: ColumnOverrides<TData, TValue> & {
		accessorKey?: keyof TData | string;
	} = {},
) {
	const { label = COLUMN_LABELS[fieldKey], accessorKey, ...rest } = overrides;

	return defineColumn<TData, TValue>({
		field: fieldKey,
		label,
		...(accessorKey ? { accessorKey } : {}),
		...rest,
	});
}

/** 이름 컬럼의 공통 variant(plain/identifier/clickable) 분기를 처리합니다. */
export function createNameColumn<TData>(
	overrides: NameColumnOverrides<TData> = {},
) {
	const {
		fieldKey = "name",
		accessorKey,
		label = COLUMN_LABELS[fieldKey],
		nameVariant = "plain",
		size = nameVariant === "plain" ? 150 : 200,
		onClickName,
		isRequired = true,
		cell,
		...rest
	} = overrides;

	const resolvedCell =
		cell ??
		(nameVariant === "clickable"
			? ({
					getValue,
					row,
				}: {
					getValue: () => unknown;
					row: { original: TData };
				}) => (
					<NameCell
						value={getValue() as string}
						variant="clickable"
						onPress={() => onClickName?.(row.original)}
					/>
				)
			: ({ getValue }: { getValue: () => unknown }) => (
					<NameCell
						value={getValue() as string}
						variant={nameVariant === "identifier" ? "identifier" : "plain"}
					/>
				));

	return createPresetColumn<TData>(fieldKey, {
		label,
		accessorKey,
		size,
		isRequired,
		cell: resolvedCell,
		...rest,
	});
}

/** displayName 컬럼을 DefaultCell 기본 규칙으로 생성합니다. */
export function createDisplayNameColumn<TData>(
	overrides: ColumnOverrides<TData> = {},
) {
	const {
		label = COLUMN_LABELS.displayName,
		size = 180,
		cell = ({ getValue }) => (
			<DefaultCell value={getValue() as string | null} />
		),
		...rest
	} = overrides;
	return createPresetColumn<TData>("displayName", {
		label,
		size,
		cell,
		...rest,
	});
}

/** group 컬럼을 DefaultCell 기본 규칙으로 생성합니다. */
export function createGroupColumn<TData>(
	overrides: ColumnOverrides<TData> = {},
) {
	const {
		label = COLUMN_LABELS.group,
		size = 160,
		cell = ({ getValue }) => (
			<DefaultCell value={getValue() as string | null} />
		),
		...rest
	} = overrides;
	return createPresetColumn<TData>("group", {
		label,
		size,
		cell,
		...rest,
	});
}

/** label 컬럼을 DefaultCell 기본 규칙으로 생성합니다. */
export function createLabelColumn<TData>(
	overrides: ColumnOverrides<TData> = {},
) {
	const {
		label = COLUMN_LABELS.label,
		size = 150,
		cell = ({ getValue }) => (
			<DefaultCell value={getValue() as string | null} />
		),
		...rest
	} = overrides;
	return createPresetColumn<TData>("label", {
		label,
		size,
		cell,
		...rest,
	});
}

/** email 컬럼을 muted + truncate 규칙으로 생성합니다. */
export function createEmailColumn<TData>(
	overrides: ColumnOverrides<TData> = {},
) {
	const {
		label = COLUMN_LABELS.email,
		size = 200,
		cell = ({ getValue }) => (
			<DefaultCell value={getValue() as string | null} tone="muted" truncate />
		),
		...rest
	} = overrides;
	return createPresetColumn<TData>("email", {
		label,
		size,
		cell,
		...rest,
	});
}

/** phone 컬럼을 PhoneCell 기반으로 생성합니다. */
export function createPhoneColumn<TData>(
	overrides: ColumnOverrides<TData> = {},
) {
	const {
		label = COLUMN_LABELS.phone,
		size = 140,
		cell = ({ getValue }) => <PhoneCell value={getValue() as string | null} />,
		...rest
	} = overrides;
	return createPresetColumn<TData>("phone", {
		label,
		size,
		cell,
		...rest,
	});
}

/** description 컬럼을 muted + lineClamp 규칙으로 생성합니다. */
export function createDescriptionColumn<TData>(
	overrides: ColumnOverrides<TData> = {},
) {
	const {
		label = COLUMN_LABELS.description,
		size = 250,
		cell = ({ getValue }) => (
			<DefaultCell
				value={getValue() as string | null}
				tone="muted"
				lineClamp={1}
			/>
		),
		...rest
	} = overrides;
	return createPresetColumn<TData>("description", {
		label,
		size,
		cell,
		...rest,
	});
}

/** createdAt 계열 컬럼을 DateTimeCell 기반으로 생성합니다. */
export function createCreatedAtColumn<TData>(
	overrides: CreatedAtColumnOverrides<TData> = {},
) {
	const {
		fieldKey = "createdAt",
		accessorKey,
		label = COLUMN_LABELS[fieldKey],
		size = 150,
		cell = ({ getValue }) => <DateTimeCell value={getValue() as string} />,
		...rest
	} = overrides;
	return createPresetColumn<TData>(fieldKey, {
		label,
		accessorKey,
		size,
		cell,
		...rest,
	});
}

/** removedAt 존재 여부로 soft delete 상태를 표시하는 상태 컬럼을 생성합니다. */
export function createRemovedAtStatusColumn<
	TData extends { removedAt?: string | null },
>(overrides: ColumnOverrides<TData> = {}) {
	const {
		label = COLUMN_LABELS.status,
		size = 120,
		align = "center",
		cell = ({ row }) => (
			<ChipCell
				label={row.original.removedAt ? "탈퇴대기" : "활성"}
				color={row.original.removedAt ? "danger" : "success"}
			/>
		),
		...rest
	} = overrides;
	return defineColumn<TData>({
		field: "removedAt",
		label,
		size,
		align,
		cell,
		...rest,
	});
}

/** 일반 status field를 사용하는 상태 컬럼을 생성합니다. */
export function createStatusColumn<TData>(
	overrides: ColumnOverrides<TData> = {},
) {
	const {
		label = COLUMN_LABELS.status,
		size = 120,
		align = "center",
		...rest
	} = overrides;
	return createPresetColumn<TData>("status", {
		label,
		size,
		align,
		...rest,
	});
}

/** boolean 활성 여부를 표시하는 isActive 컬럼을 생성합니다. */
export function createIsActiveColumn<TData>(
	overrides: ColumnOverrides<TData> = {},
) {
	const {
		label = COLUMN_LABELS.isActive,
		size = 120,
		align = "center",
		...rest
	} = overrides;
	return createPresetColumn<TData>("isActive", {
		label,
		size,
		align,
		...rest,
	});
}

/** 행 단위 액션 버튼 영역에 사용하는 actions 컬럼을 생성합니다. */
export function createActionsColumn<TData>(
	overrides: ColumnOverrides<TData> = {},
) {
	const {
		label = COLUMN_LABELS.actions,
		size = 80,
		align = "center",
		...rest
	} = overrides;
	return createPresetColumn<TData>("actions", {
		label,
		size,
		align,
		...rest,
	});
}

/** 액션 그룹 이름을 HeroUI Chip 색상으로 매핑합니다. */
export function getActionGroupColor(
	group?: string,
): "primary" | "secondary" | "success" | "warning" | "danger" | "default" {
	switch (group) {
		case "crud":
			return "primary";
		case "visibility":
			return "secondary";
		case "workflow":
			return "success";
		case "bulk":
			return "warning";
		default:
			return "default";
	}
}

/** 액션 그룹 코드를 운영자가 이해하기 쉬운 표시 라벨로 변환합니다. */
export function getActionGroupLabel(group?: string) {
	switch (group) {
		case "crud":
			return "CRUD";
		case "visibility":
			return "표시/마스킹";
		case "bulk":
			return "일괄";
		case "workflow":
			return "워크플로우";
		default:
			return group;
	}
}

/** 초 단위 duration을 화면 표시에 맞는 한국어 문자열로 변환합니다. */
export function formatDuration(seconds: number) {
	const minutes = Math.floor(seconds / 60);
	const remainSeconds = seconds % 60;
	return minutes > 0 ? `${minutes}분 ${remainSeconds}초` : `${remainSeconds}초`;
}

/** 자산 종류 enum을 사용자용 한글 라벨로 변환합니다. */
export function getAssetKindLabel(kind: AssetKind) {
	switch (kind) {
		case "IMAGE":
			return "이미지";
		case "VIDEO":
			return "비디오";
		case "DOCUMENT":
			return "문서";
		default:
			return kind;
	}
}

/** 자산 상태 enum을 HeroUI Chip 색상으로 매핑합니다. */
export function getAssetStatusColor(
	status: AssetStatus,
): "success" | "warning" | "danger" {
	switch (status) {
		case "READY":
			return "success";
		case "UPLOADING":
			return "warning";
		case "FAILED":
			return "danger";
		default:
			return "warning";
	}
}

/** 자산 상태 enum을 사용자용 한글 라벨로 변환합니다. */
export function getAssetStatusLabel(status: AssetStatus) {
	switch (status) {
		case "READY":
			return "완료";
		case "UPLOADING":
			return "업로드 중";
		case "FAILED":
			return "실패";
		default:
			return status;
	}
}

/** byte 값을 사람이 읽기 쉬운 용량 문자열로 변환합니다. */
export function formatAssetBytes(bytes: number) {
	if (bytes === 0) {
		return "0 B";
	}

	const units = ["B", "KB", "MB", "GB"];
	const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), 3);
	const value = bytes / 1024 ** exponent;
	return `${value.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}
