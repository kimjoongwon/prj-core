"use client";

import type { AssetKind, AssetStatus } from "@cocrepo/api/assets";
import type { MetaDataGridColumnConfig } from "@cocrepo/type";
import { Chip } from "@heroui/react";
import { DateTimeCell, NameCell, StatusChipCell } from "../../cell";
import { COLUMN_FIELDS, COLUMN_LABELS } from "./fieldPresets";

type PresetColumnKey = keyof typeof COLUMN_FIELDS & keyof typeof COLUMN_LABELS;

export type ColumnOverrides<TData, TValue = unknown> = Partial<
  Omit<MetaDataGridColumnConfig<TData, TValue>, "field">
>;

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

export function defineColumn<TData, TValue = unknown>(
  column: MetaDataGridColumnConfig<TData, TValue>,
) {
  return column;
}

export function buildColumns<TData>(
  ...columns: MetaDataGridColumnConfig<TData, unknown>[]
) {
  return columns;
}

export function buildColumnsWithDefaultCreatedAt<TData>(
  leading: MetaDataGridColumnConfig<TData, unknown>[],
  trailing: MetaDataGridColumnConfig<TData, unknown>[] = [],
) {
  return buildColumns<TData>(
    ...leading,
    createCreatedAtColumn<TData>(),
    ...trailing,
  );
}

export function createPresetColumn<TData, TValue = unknown>(
  fieldKey: PresetColumnKey,
  overrides: ColumnOverrides<TData, TValue> & {
    accessorKey?: keyof TData | string;
  } = {},
) {
  const { label = COLUMN_LABELS[fieldKey], accessorKey, ...rest } = overrides;

  return defineColumn<TData, TValue>({
    field: COLUMN_FIELDS[fieldKey],
    label,
    ...(accessorKey ? { accessorKey } : {}),
    ...rest,
  });
}

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

export function createDisplayNameColumn<TData>(
  overrides: ColumnOverrides<TData> = {},
) {
  const { label = COLUMN_LABELS.displayName, size = 180, ...rest } = overrides;
  return createPresetColumn<TData>("displayName", {
    label,
    size,
    ...rest,
  });
}

export function createGroupColumn<TData>(
  overrides: ColumnOverrides<TData> = {},
) {
  const { label = COLUMN_LABELS.group, size = 160, ...rest } = overrides;
  return createPresetColumn<TData>("group", {
    label,
    size,
    ...rest,
  });
}

export function createLabelColumn<TData>(
  overrides: ColumnOverrides<TData> = {},
) {
  const { label = COLUMN_LABELS.label, size = 150, ...rest } = overrides;
  return createPresetColumn<TData>("label", {
    label,
    size,
    ...rest,
  });
}

export function createEmailColumn<TData>(
  overrides: ColumnOverrides<TData> = {},
) {
  const { label = COLUMN_LABELS.email, size = 200, ...rest } = overrides;
  return createPresetColumn<TData>("email", {
    label,
    size,
    ...rest,
  });
}

export function createPhoneColumn<TData>(
  overrides: ColumnOverrides<TData> = {},
) {
  const { label = COLUMN_LABELS.phone, size = 140, ...rest } = overrides;
  return createPresetColumn<TData>("phone", {
    label,
    size,
    ...rest,
  });
}

export function createDescriptionColumn<TData>(
  overrides: ColumnOverrides<TData> = {},
) {
  const { label = COLUMN_LABELS.description, size = 250, ...rest } = overrides;
  return createPresetColumn<TData>("description", {
    label,
    size,
    ...rest,
  });
}

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

export function createRemovedAtStatusColumn<
  TData extends { removedAt?: string | null },
>(overrides: ColumnOverrides<TData> = {}) {
  const {
    label = COLUMN_LABELS.status,
    size = 120,
    align = "center",
    cell = ({ row }) => <StatusChipCell removedAt={row.original.removedAt} />,
    ...rest
  } = overrides;
  return defineColumn<TData>({
    field: COLUMN_FIELDS.removedAt,
    label,
    size,
    align,
    cell,
    ...rest,
  });
}

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

export function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainSeconds = seconds % 60;
  return minutes > 0 ? `${minutes}분 ${remainSeconds}초` : `${remainSeconds}초`;
}

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

export function formatAssetBytes(bytes: number) {
  if (bytes === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), 3);
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

export function LockStatusCell({
  isPermanentlyLocked,
  lockedUntil,
}: {
  isPermanentlyLocked: boolean;
  lockedUntil?: string | null;
}) {
  if (isPermanentlyLocked) {
    return (
      <div className="flex w-full justify-center">
        <Chip size="sm" color="danger" variant="flat">
          영구잠금
        </Chip>
      </div>
    );
  }

  if (lockedUntil) {
    return (
      <div className="flex w-full justify-center">
        <Chip size="sm" color="warning" variant="flat">
          일시잠금
        </Chip>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center">
      <Chip size="sm" color="success" variant="flat">
        정상
      </Chip>
    </div>
  );
}

export function FailedAttemptsCell({ count }: { count: number }) {
  const isDanger = count >= 5;
  return (
    <div className="flex w-full justify-center">
      <span className={isDanger ? "font-semibold text-danger" : ""}>
        {count}
      </span>
    </div>
  );
}
