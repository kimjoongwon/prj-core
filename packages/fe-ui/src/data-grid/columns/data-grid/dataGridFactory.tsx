"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
	ChipCell,
	DateTimeCell,
	DefaultCell,
	NameCell,
	PhoneCell,
} from "../../cell";

const COLUMN_LABELS = {
	name: "이름",
	roleKey: "역할 식별자",
	displayName: "표시명",
	email: "이메일",
	phone: "전화번호",
	description: "설명",
	createdAt: "등록일",
	signedUpAt: "가입일",
	status: "상태",
	actions: "",
	role: "역할",
} as const;

type PresetColumnKey = keyof typeof COLUMN_LABELS;

/**
 * 서로 다른 accessor 값 타입을 가진 컬럼을 한 배열에 담는 경계입니다.
 * 개별 컬럼은 TanStack `ColumnDef<TData, TValue>`를 그대로 유지하고,
 * 컬럼 모음에서만 TanStack의 heterogeneous ColumnDef 규칙을 따릅니다.
 */
// biome-ignore lint/suspicious/noExplicitAny: TanStack ColumnDef is invariant in TValue for heterogeneous columns.
type HeterogeneousDataGridColumns<TData> = ColumnDef<TData, any>[];

export type ColumnOverrides<TData, TValue = unknown> = Partial<
	ColumnDef<TData, TValue>
>;

type NameColumnOverrides<TData> = ColumnOverrides<TData, string | null> & {
	fieldKey?: "name" | "roleKey";
	accessorKey?: keyof TData | string;
	nameVariant?: "plain" | "identifier" | "clickable";
	onClickName?: (row: TData) => void;
};

type CreatedAtColumnOverrides<TData> = ColumnOverrides<TData, Date | null> & {
	fieldKey?: "createdAt" | "signedUpAt";
	accessorKey?: keyof TData | string;
};

/** DataGrid 컬럼 객체를 그대로 반환해 제네릭 정보를 보존합니다. */
export function defineColumn<TData, TValue = unknown>(
	column: ColumnDef<TData, TValue>,
) {
	return column;
}

/** 호출부에서 컬럼 순서를 명시적으로 유지하도록 tuple 형태로 묶습니다. */
export function buildColumns<
	TData,
	const TColumns extends
		HeterogeneousDataGridColumns<TData> = HeterogeneousDataGridColumns<TData>,
>(...columns: TColumns & HeterogeneousDataGridColumns<TData>): TColumns {
	return columns;
}

/** 목록 화면에서 자주 쓰는 createdAt 후행 컬럼을 공통 규칙으로 붙입니다. */
export function buildColumnsWithDefaultCreatedAt<
	TData,
	const TLeading extends
		HeterogeneousDataGridColumns<TData> = HeterogeneousDataGridColumns<TData>,
	const TTrailing extends
		HeterogeneousDataGridColumns<TData> = HeterogeneousDataGridColumns<TData>,
>(
	leading: TLeading,
	trailing: TTrailing = [] as unknown as TTrailing,
	// TanStack ColumnDef는 TValue에 대해 불변이라 열 요소 타입은 라이브러리 관용대로 any를 유지한다.
	// biome-ignore lint/suspicious/noExplicitAny: unknown 요소와의 할당 호환(소비처 ColumnDef<TData, unknown>[] 전달)을 위해 필요
): [...TLeading, ColumnDef<TData, any>, ...TTrailing] {
	return [...leading, createCreatedAtColumn<TData>(), ...trailing] as [
		...TLeading,
		// biome-ignore lint/suspicious/noExplicitAny: 반환 튜플 요소도 같은 이유로 any를 유지한다
		ColumnDef<TData, any>,
		...TTrailing,
	];
}

/** preset fieldKey를 실제 DataGrid 컬럼 정의로 해석합니다. */
export function createPresetColumn<TData, TValue = unknown>(
	fieldKey: PresetColumnKey,
	overrides: ColumnOverrides<TData, TValue> & {
		accessorKey?: keyof TData | string;
	} = {},
) {
	const { header = COLUMN_LABELS[fieldKey], accessorKey, ...rest } = overrides;

	return defineColumn<TData, TValue>({
		accessorKey: accessorKey ?? fieldKey,
		header,
		...rest,
	});
}

/** 이름 컬럼의 공통 variant(plain/identifier/clickable) 분기를 처리합니다. */
export function createNameColumn<TData>(
	overrides: NameColumnOverrides<TData> = {},
) {
	const {
		fieldKey = "name",
		accessorKey = fieldKey,
		header = COLUMN_LABELS[fieldKey],
		nameVariant = "plain",
		size = nameVariant === "plain" ? 150 : 200,
		onClickName,
		enableHiding = false,
		cell,
		...rest
	} = overrides;

	const resolvedCell =
		cell ??
		(nameVariant === "clickable"
			? ({ getValue, row }) => (
					<NameCell
						value={getValue()}
						variant="clickable"
						onPress={() => onClickName?.(row.original)}
					/>
				)
			: ({ getValue }) => (
					<NameCell
						value={getValue()}
						variant={nameVariant === "identifier" ? "identifier" : "plain"}
					/>
				));

	return createPresetColumn<TData, string | null>(fieldKey, {
		header,
		accessorKey: String(accessorKey),
		size,
		enableHiding,
		cell: resolvedCell,
		...rest,
	});
}

/** displayName 컬럼을 DefaultCell 기본 규칙으로 생성합니다. */
export function createDisplayNameColumn<TData>(
	overrides: ColumnOverrides<TData, string | null> = {},
) {
	const {
		header = COLUMN_LABELS.displayName,
		size = 180,
		cell = ({ getValue }) => <DefaultCell value={getValue()} />,
		...rest
	} = overrides;
	return createPresetColumn<TData, string | null>("displayName", {
		header,
		size,
		cell,
		...rest,
	});
}

/** email 컬럼을 muted + truncate 규칙으로 생성합니다. */
export function createEmailColumn<TData>(
	overrides: ColumnOverrides<TData, string | null> = {},
) {
	const {
		header = COLUMN_LABELS.email,
		size = 200,
		cell = ({ getValue }) => (
			<DefaultCell value={getValue()} tone="muted" truncate />
		),
		...rest
	} = overrides;
	return createPresetColumn<TData, string | null>("email", {
		header,
		size,
		cell,
		...rest,
	});
}

/** phone 컬럼을 PhoneCell 기반으로 생성합니다. */
export function createPhoneColumn<TData>(
	overrides: ColumnOverrides<TData, string | null> = {},
) {
	const {
		header = COLUMN_LABELS.phone,
		size = 140,
		cell = ({ getValue }) => <PhoneCell value={getValue()} />,
		...rest
	} = overrides;
	return createPresetColumn<TData, string | null>("phone", {
		header,
		size,
		cell,
		...rest,
	});
}

/** description 컬럼을 muted + lineClamp 규칙으로 생성합니다. */
export function createDescriptionColumn<TData>(
	overrides: ColumnOverrides<TData, string | null> = {},
) {
	const {
		header = COLUMN_LABELS.description,
		size = 250,
		cell = ({ getValue }) => (
			<DefaultCell value={getValue()} tone="muted" lineClamp={1} />
		),
		...rest
	} = overrides;
	return createPresetColumn<TData, string | null>("description", {
		header,
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
		header = COLUMN_LABELS[fieldKey],
		size = 150,
		cell = ({ getValue }) => <DateTimeCell value={getValue()} />,
		...rest
	} = overrides;
	return createPresetColumn<TData, Date | null>(fieldKey, {
		header,
		accessorKey,
		size,
		cell,
		...rest,
	});
}

/** removedAt 존재 여부로 soft delete 상태를 표시하는 상태 컬럼을 생성합니다. */
export function createRemovedAtStatusColumn<
	TData extends { removedAt?: Date | null },
>(overrides: ColumnOverrides<TData> = {}) {
	const {
		header = COLUMN_LABELS.status,
		size = 120,
		cell = ({ row }) => (
			<ChipCell
				label={row.original.removedAt ? "탈퇴대기" : "활성"}
				color={row.original.removedAt ? "danger" : "success"}
			/>
		),
		...rest
	} = overrides;
	return defineColumn<TData>({
		accessorKey: "removedAt",
		header,
		size,
		cell,
		...rest,
	});
}

/** 일반 status field를 사용하는 상태 컬럼을 생성합니다. */
export function createStatusColumn<TData>(
	overrides: ColumnOverrides<TData> = {},
) {
	const { header = COLUMN_LABELS.status, size = 120, ...rest } = overrides;
	return createPresetColumn<TData>("status", {
		header,
		size,
		...rest,
	});
}

/** 행 단위 액션 버튼 영역에 사용하는 actions 컬럼을 생성합니다. */
export function createActionsColumn<TData>(
	overrides: ColumnOverrides<TData> = {},
) {
	const { header = COLUMN_LABELS.actions, size = 80, ...rest } = overrides;
	return createPresetColumn<TData>("actions", {
		header,
		size,
		...rest,
	});
}
