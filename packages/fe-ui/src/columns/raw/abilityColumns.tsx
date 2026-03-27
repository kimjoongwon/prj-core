"use client";

import { Chip } from "@heroui/react";
import {
  buildPageColumnsWithDefaultCreatedAt,
  createPageNameColumn,
  createPresetPageColumn,
} from "../internal/rawFactory";

export function buildAbilityListTableColumns<
  TRow extends {
    id: string;
    name: string;
    subjectId: string;
    actionId: string;
    subjectLabel: string;
    actionLabel: string;
    inverted: boolean;
    fieldCount: number;
    hasConditions: boolean;
    createdAt: string | Date | null;
  },
>() {
  return buildPageColumnsWithDefaultCreatedAt<TRow>([
    createPageNameColumn<TRow>({
      size: 180,
      cell: (ability) => (
        <span className="font-mono text-sm">{ability.name}</span>
      ),
    }),
    createPresetPageColumn<TRow>("subjectLabel", {
      size: 150,
      cell: (ability) => (
        <span className="text-sm">{ability.subjectLabel || "-"}</span>
      ),
    }),
    createPresetPageColumn<TRow>("actionLabel", {
      size: 120,
      cell: (ability) => (
        <span className="text-sm">{ability.actionLabel || "-"}</span>
      ),
    }),
    createPresetPageColumn<TRow>("inverted", {
      size: 100,
      align: "center",
      cell: (ability) => (
        <Chip
          size="sm"
          color={ability.inverted ? "danger" : "success"}
          variant="flat"
        >
          {ability.inverted ? "거부(cannot)" : "허용(can)"}
        </Chip>
      ),
    }),
    createPresetPageColumn<TRow>("fieldCount", {
      size: 80,
      align: "center",
      cell: (ability) => (
        <span className="text-sm">
          {ability.fieldCount === 0 ? "전체" : ability.fieldCount}
        </span>
      ),
    }),
    createPresetPageColumn<TRow>("hasConditions", {
      size: 80,
      align: "center",
      cell: (ability) => (
        <Chip
          size="sm"
          color={ability.hasConditions ? "primary" : "default"}
          variant="flat"
        >
          {ability.hasConditions ? "있음" : "없음"}
        </Chip>
      ),
    }),
  ]);
}
