"use client";

import type { RoleDto } from "@cocrepo/api/core/roles";
import { Chip } from "@heroui/react";
import { StatusChipCell } from "../../cell";
import {
  buildPageColumnsWithDefaultCreatedAt,
  createPageDescriptionColumn,
  createPageDisplayNameColumn,
  createPageNameColumn,
  createPresetPageColumn,
} from "../internal/rawFactory";

export const adminRoleNameColumn = createPageNameColumn<RoleDto>({
  fieldKey: "roleKey",
  size: 180,
  cell: (role) => (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm">{role.name}</span>
      {role.isSystem ? (
        <Chip size="sm" color="warning" variant="flat">
          시스템
        </Chip>
      ) : null}
    </div>
  ),
});

export const adminRoleDisplayNameColumn =
  createPageDisplayNameColumn<RoleDto>();

export const adminRoleDescriptionColumn =
  createPageDescriptionColumn<RoleDto>();

export const adminRoleStatusColumn = createPresetPageColumn<RoleDto>("status", {
  size: 100,
  align: "center",
  cell: (role) => <StatusChipCell removedAt={role.removedAt} />,
});

export const adminRoleTableColumns =
  buildPageColumnsWithDefaultCreatedAt<RoleDto>([
    adminRoleNameColumn,
    adminRoleDisplayNameColumn,
    adminRoleDescriptionColumn,
    adminRoleStatusColumn,
  ]);
