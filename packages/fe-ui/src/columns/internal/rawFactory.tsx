"use client";

import type { ReactNode } from "react";
import { DateTimeCell, NameCell } from "../../cell";
import { COLUMN_FIELDS, COLUMN_LABELS } from "./fieldPresets";

type PagePresetKey = keyof typeof COLUMN_FIELDS & keyof typeof COLUMN_LABELS;

export interface PageTableColumn<TData> {
  field: string;
  label: string;
  size: number;
  align?: "center";
  cell: (row: TData) => ReactNode;
}

type PageColumnOverrides<TData> = Partial<
  Omit<PageTableColumn<TData>, "field" | "cell">
> & {
  cell?: (row: TData) => ReactNode;
};

type RequiredPageColumnOverrides<TData> = Omit<
  PageTableColumn<TData>,
  "field" | "label"
> & {
  label?: string;
};

type PresetPageColumnOverrides<TData> = PageColumnOverrides<TData> & {
  fieldKey?: PagePresetKey;
};

function definePageColumn<TData>(column: PageTableColumn<TData>) {
  return column;
}

export function createPresetPageColumn<TData>(
  fieldKey: PagePresetKey,
  overrides: RequiredPageColumnOverrides<TData>,
) {
  const { label = COLUMN_LABELS[fieldKey], ...rest } = overrides;

  return definePageColumn<TData>({
    field: COLUMN_FIELDS[fieldKey],
    label,
    ...rest,
  });
}

export function buildPageColumnsWithDefaultCreatedAt<
  TData extends { createdAt: string | Date | null },
>(leading: PageTableColumn<TData>[]) {
  return [...leading, createPageCreatedAtColumn<TData>()] as const;
}

export function createPageNameColumn<TData extends { name: string }>(
  overrides: PresetPageColumnOverrides<TData> & {
    fieldKey?: "name" | "roleKey";
  } = {},
) {
  const {
    fieldKey = "name",
    label = COLUMN_LABELS[fieldKey],
    size = 150,
    cell = (row) => <NameCell value={row.name} />,
    ...rest
  } = overrides;

  return createPresetPageColumn<TData>(fieldKey, {
    label,
    size,
    cell,
    ...rest,
  });
}

export function createPageDisplayNameColumn<
  TData extends { displayName?: string | null },
>(overrides: PageColumnOverrides<TData> = {}) {
  const {
    label = COLUMN_LABELS.displayName,
    size = 150,
    cell = (row) => row.displayName ?? "-",
    ...rest
  } = overrides;

  return createPresetPageColumn<TData>("displayName", {
    label,
    size,
    cell,
    ...rest,
  });
}

export function createPageDescriptionColumn<
  TData extends { description?: string | null },
>(overrides: PageColumnOverrides<TData> = {}) {
  const {
    label = COLUMN_LABELS.description,
    size = 250,
    cell = (row) => (
      <span className="text-default-500 text-sm line-clamp-1">
        {row.description || "-"}
      </span>
    ),
    ...rest
  } = overrides;

  return createPresetPageColumn<TData>("description", {
    label,
    size,
    cell,
    ...rest,
  });
}

export function createPageCreatedAtColumn<
  TData extends { createdAt: string | Date | null },
>(
  overrides: PresetPageColumnOverrides<TData> & {
    fieldKey?: "createdAt" | "signedUpAt" | "receivedAt" | "occurredAt";
  } = {},
) {
  const {
    fieldKey = "createdAt",
    label = COLUMN_LABELS[fieldKey],
    size = 150,
    cell = (row) => <DateTimeCell value={row.createdAt} />,
    ...rest
  } = overrides;

  return createPresetPageColumn<TData>(fieldKey, {
    label,
    size,
    cell,
    ...rest,
  });
}
