"use client";

import type { AssetDto } from "@cocrepo/api/assets";
import type { ActionDto } from "@cocrepo/api/core/actions";
import type { RoutineDto } from "@cocrepo/api/core/routines";
import type { SubjectDto } from "@cocrepo/api/core/subjects";
import type { TaskDto } from "@cocrepo/api/core/tasks";
import type { TemplateDto } from "@cocrepo/api/core/templates";
import type { TimelineDto } from "@cocrepo/api/core/timelines";
import { Badge, Button, Chip, Switch } from "@heroui/react";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import {
  InquiryAssigneeCell,
  InquiryCategoryCell,
  InquiryChannelCell,
  InquiryPriorityCell,
  InquirySentimentCell,
  InquirySLACell,
  InquiryStatusCell,
  InquiryUnreadCell,
  PhoneCell,
  ProfileAvatarCell,
  StatusChipCell,
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

export const actionGroupColumn = createGroupColumn<ActionDto>({
  size: 120,
  align: "center",
  cell: ({ getValue }) => {
    const group = getValue() as string | undefined;
    if (!group) {
      return <span className="text-default-400">-</span>;
    }

    return (
      <Chip size="sm" color={getActionGroupColor(group)} variant="flat">
        {group}
      </Chip>
    );
  },
});

export const actionOrderColumn = createPresetColumn<ActionDto>("order", {
  size: 80,
  align: "center",
});

export const actionIsSystemColumn = createPresetColumn<ActionDto>("isSystem", {
  size: 100,
  align: "center",
  cell: ({ getValue }) => {
    const isSystem = getValue() as boolean;
    return (
      <Chip size="sm" color={isSystem ? "warning" : "default"} variant="flat">
        {isSystem ? "시스템" : "사용자"}
      </Chip>
    );
  },
});

export const actionCreatedAtColumn = createCreatedAtColumn<ActionDto>({
  size: 150,
});

export const actionRemovedAtColumn = createRemovedAtStatusColumn<ActionDto>({
  size: 100,
});

export const actionTableColumns = buildColumns<ActionDto>(
  actionNameColumn,
  actionDisplayNameColumn,
  actionGroupColumn,
  actionOrderColumn,
  actionIsSystemColumn,
  actionCreatedAtColumn,
  actionRemovedAtColumn,
);

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
  return buildColumns<TRow>(
    createNameColumn<TRow>(),
    createEmailColumn<TRow>({
      cell: ({ getValue }) => (
        <div className="max-w-[240px] truncate text-sm text-default-500">
          {(getValue() as string) ?? "-"}
        </div>
      ),
    }),
    createPhoneColumn<TRow>({
      size: 150,
      cell: ({ getValue }) => (
        <div className="text-sm font-medium tabular-nums text-foreground/80">
          <PhoneCell value={(getValue() as string) ?? ""} />
        </div>
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

export const subjectTableColumns = buildColumns<SubjectDto>(
  subjectNameColumn,
  subjectDisplayNameColumn,
  subjectGroupColumn,
  subjectCreatedAtColumn,
  subjectRemovedAtColumn,
);

export function buildTaskTableColumns<
  TRow extends {
    id: string;
    name: string;
    duration: number;
    count: number;
    description?: string;
    createdAt: string;
    task: TaskDto;
  },
>({
  onClickTaskName,
  onClickDeleteButton,
}: {
  onClickTaskName: (taskId: string) => void;
  onClickDeleteButton: (task: TaskDto) => void;
}) {
  return buildColumnsWithDefaultCreatedAt<TRow>(
    [
      createNameColumn<TRow>({
        nameVariant: "clickable",
        onClickName: (row) => onClickTaskName(row.id),
      }),
      createPresetColumn<TRow>("duration", {
        size: 100,
        align: "center",
        cell: ({ getValue }) => (
          <span>{formatDuration(getValue() as number)}</span>
        ),
      }),
      createPresetColumn<TRow>("count", {
        size: 80,
        align: "center",
        cell: ({ getValue }) => <span>{getValue() as number}회</span>,
      }),
      createDescriptionColumn<TRow>({
        cell: ({ getValue }) => (
          <span className="line-clamp-2 text-sm text-default-500">
            {(getValue() as string | undefined) || "-"}
          </span>
        ),
      }),
    ],
    [
      createActionsColumn<TRow>({
        cell: ({ row }) => (
          <button
            type="button"
            className="cursor-pointer text-sm text-danger hover:text-danger-600"
            onClick={() => onClickDeleteButton(row.original.task)}
          >
            삭제
          </button>
        ),
      }),
    ],
  );
}

export function buildTimelineTableColumns({
  onClickTimelineName,
  onClickDeleteButton,
}: {
  onClickTimelineName: (timeline: TimelineDto) => void;
  onClickDeleteButton: (timeline: TimelineDto) => void;
}) {
  return buildColumnsWithDefaultCreatedAt<TimelineDto>(
    [
      createNameColumn<TimelineDto>({
        nameVariant: "clickable",
        onClickName: onClickTimelineName,
      }),
      createDescriptionColumn<TimelineDto>({
        size: 300,
        cell: ({ getValue }) => (
          <span className="line-clamp-1 text-sm text-default-500">
            {(getValue() as string) || "-"}
          </span>
        ),
      }),
    ],
    [
      createActionsColumn<TimelineDto>({
        cell: ({ row }) => (
          <Button
            size="sm"
            color="danger"
            variant="light"
            onPress={() => onClickDeleteButton(row.original)}
          >
            삭제
          </Button>
        ),
      }),
    ],
  );
}

export function buildTemplateTableColumns({
  onClickTemplateCode,
  onToggleTemplateStatusSwitch,
}: {
  onClickTemplateCode: (template: TemplateDto) => void;
  onToggleTemplateStatusSwitch: (templateId: string) => Promise<void>;
}) {
  return buildColumns<TemplateDto>(
    createPresetColumn<TemplateDto>("code", {
      size: 220,
      isRequired: true,
      cell: ({ row }) => (
        <Button
          className="justify-start p-0 font-mono text-sm"
          variant="light"
          onPress={() => onClickTemplateCode(row.original)}
        >
          {row.original.code}
        </Button>
      ),
    }),
    createNameColumn<TemplateDto>({
      size: 220,
    }),
    createIsActiveColumn<TemplateDto>({
      cell: ({ row }) => (
        <Switch
          isSelected={row.original.isActive}
          onValueChange={() => onToggleTemplateStatusSwitch(row.original.id)}
        />
      ),
    }),
    createCreatedAtColumn<TemplateDto>({
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
  return buildColumnsWithDefaultCreatedAt<TRow>([
    createNameColumn<TRow>({
      nameVariant: "clickable",
      onClickName: (row) => onClickSpaceGroundName(row.id),
    }),
    createLabelColumn<TRow>({
      size: 120,
      align: "center",
      cell: ({ getValue }) => {
        const label = getValue() as string | null;
        if (!label) {
          return <span className="text-default-400">-</span>;
        }

        return (
          <Badge color="secondary" variant="flat">
            {label}
          </Badge>
        );
      },
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

export function buildRoutineTableColumns({
  onClickRoutineName,
  onClickDeleteButton,
}: {
  onClickRoutineName: (routine: RoutineDto) => void;
  onClickDeleteButton: (routine: RoutineDto) => void;
}) {
  return buildColumnsWithDefaultCreatedAt<RoutineDto>(
    [
      createNameColumn<RoutineDto>({
        nameVariant: "clickable",
        onClickName: onClickRoutineName,
      }),
      createLabelColumn<RoutineDto>({
        cell: ({ getValue }) => (
          <span className="text-default-600">
            {(getValue() as string) || "-"}
          </span>
        ),
      }),
    ],
    [
      createActionsColumn<RoutineDto>({
        cell: ({ row }) => (
          <button
            type="button"
            className="flex cursor-pointer items-center justify-center text-danger hover:text-danger-600"
            onClick={() => onClickDeleteButton(row.original)}
          >
            <Trash2 className="size-4" />
          </button>
        ),
      }),
    ],
  );
}

export function buildAssetTableColumns({
  isRemoving,
  onClickDeleteAssetButton,
}: {
  isRemoving: boolean;
  onClickDeleteAssetButton: (assetId: string) => void;
}) {
  return buildColumnsWithDefaultCreatedAt<AssetDto>(
    [
      createPresetColumn<AssetDto>("originalName", {
        size: 280,
        isRequired: true,
        cell: ({ row }) => (
          <Link
            href={`/assets/${row.original.id}` as Route}
            className="text-primary hover:underline"
          >
            {row.original.originalName}
          </Link>
        ),
      }),
      createPresetColumn<AssetDto>("kind", {
        size: 100,
        align: "center",
        cell: ({ row }) => (
          <Chip size="sm" variant="flat" color="secondary">
            {getAssetKindLabel(row.original.kind)}
          </Chip>
        ),
      }),
      createStatusColumn<AssetDto>({
        cell: ({ row }) => (
          <Chip
            size="sm"
            variant="flat"
            color={getAssetStatusColor(row.original.status)}
          >
            {getAssetStatusLabel(row.original.status)}
          </Chip>
        ),
      }),
      createPresetColumn<AssetDto>("mimeType", {
        size: 180,
        cell: ({ getValue }) => (
          <span className="font-mono text-xs">{getValue() as string}</span>
        ),
      }),
      createPresetColumn<AssetDto>("sizeBytes", {
        size: 120,
        align: "right",
        cell: ({ getValue }) => formatAssetBytes(getValue() as number),
      }),
    ],
    [
      createActionsColumn<AssetDto>({
        size: 100,
        align: "center",
        cell: ({ row }) => (
          <Button
            size="sm"
            variant="flat"
            color="danger"
            isLoading={isRemoving}
            startContent={<Trash2 className="h-4 w-4" />}
            onPress={() => onClickDeleteAssetButton(row.original.id)}
          >
            삭제
          </Button>
        ),
      }),
    ],
  );
}

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
        <span className="line-clamp-2">{getValue() as string}</span>
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
      cell: ({ row }) => {
        const status = row.original.slaStatus;
        const remainingMinutes = row.original.slaRemainingMinutes;

        if (!status || remainingMinutes === undefined) {
          return <span className="text-default-400">-</span>;
        }

        return (
          <InquirySLACell status={status} remainingMinutes={remainingMinutes} />
        );
      },
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
