"use client";

import {
  type ActionDto,
  useGetActionsSuspense,
} from "@cocrepo/api/core/actions";
import type { InputConfig, MetaDataGridColumnConfig } from "@cocrepo/type";
import {
  DateTimeCell,
  MetaDataGrid,
  Page,
  PageSurface,
  PageTitleBar,
  SectionSurface,
  StatusChipCell,
  useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import { Chip } from "@heroui/react";
import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

const leftInputs: InputConfig[] = [
  {
    type: "search",
    id: "search",
    placeholder: "이름으로 검색...",
    props: {
      debounceMs: 300,
    },
  },
];

const groupQueryInputs: InputConfig[] = [
  {
    type: "select",
    id: "group",
    props: {
      defaultValue: "",
    },
  },
];

function getGroupColor(
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

const columns: MetaDataGridColumnConfig<ActionDto>[] = [
  {
    field: "name",
    label: "행위 식별자",
    size: 200,
    isRequired: true,
    cell: ({ getValue }) => (
      <span className="font-mono text-sm">{getValue() as string}</span>
    ),
  },
  {
    field: "displayName",
    label: "표시명",
    size: 150,
  },
  {
    field: "group",
    label: "분류",
    size: 120,
    align: "center",
    cell: ({ getValue }) => {
      const group = getValue() as string | undefined;
      if (!group) return <span className="text-default-400">-</span>;
      return (
        <Chip size="sm" color={getGroupColor(group)} variant="flat">
          {group}
        </Chip>
      );
    },
  },
  {
    field: "order",
    label: "순서",
    size: 80,
    align: "center",
  },
  {
    field: "isSystem",
    label: "시스템",
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
  },
  {
    field: "createdAt",
    label: "생성일",
    size: 150,
    cell: ({ getValue }) => <DateTimeCell value={getValue() as string} />,
  },
  {
    field: "removedAt",
    label: "상태",
    size: 100,
    align: "center",
    cell: ({ row }) => <StatusChipCell removedAt={row.original.removedAt} />,
  },
];

type ActionsQueryStates = ReturnType<typeof useMetaDataGridQueryStates>[0];
type SetActionsQueryStates = ReturnType<typeof useMetaDataGridQueryStates>[1];

function filterActions(actions: ActionDto[], search?: string) {
  const searchKeyword = search?.trim().toLowerCase() ?? "";
  if (!searchKeyword) {
    return actions;
  }

  return actions.filter((action) =>
    [action.name, action.displayName]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(searchKeyword)),
  );
}

function buildRightInputs(onClickCreateButton: () => void): InputConfig[] {
  return [
    {
      type: "button",
      id: "create",
      label: "등록",
      props: {
        variant: "flat",
        color: "primary",
        startContent: <Plus className="h-4 w-4" />,
      },
      handlers: {
        onClick: onClickCreateButton,
      },
    },
  ];
}

const ActionsPageContent = observer(function ActionsPageContent({
  queryStates,
  setQueryStates,
  rightInputs,
}: {
  queryStates: ActionsQueryStates;
  setQueryStates: SetActionsQueryStates;
  rightInputs: InputConfig[];
}) {
  const { data: response } = useGetActionsSuspense({
    group: queryStates.group || undefined,
  });
  const actions = response?.data ?? [];
  const filteredActions = filterActions(actions, queryStates.search);
  const totalCount = queryStates.search?.trim().length
    ? filteredActions.length
    : (response?.meta?.total ?? actions.length);

  return (
    <MetaDataGrid
      config={{
        entity: "Action",
        data: filteredActions,
        totalCount,
        isLoading: false,
        queryStates,
        setQueryStates,
        columns,
        leftInputs,
        rightInputs,
        emptyMessage: "조회된 Action이 없습니다.",
      }}
    />
  );
});

const ActionsPageInner = observer(function ActionsPageInner() {
  const router = useRouter();
  const [queryStates, setQueryStates] = useMetaDataGridQueryStates([
    ...leftInputs,
    ...groupQueryInputs,
  ]);

  const onClickCreateButton = () => {
    router.push("/actions/new" as Route);
  };

  const rightInputs = buildRightInputs(onClickCreateButton);

  return (
    <Page
      top={
        <PageTitleBar
          title="Action 목록"
          description="시스템에 등록된 Action을 조회합니다."
        />
      }
    >
      <PageSurface>
        <SectionSurface padding="none">
          <Suspense
            fallback={
              <MetaDataGrid
                config={{
                  entity: "Action",
                  data: [],
                  totalCount: 0,
                  isLoading: true,
                  queryStates,
                  setQueryStates,
                  columns,
                  leftInputs,
                  rightInputs,
                  emptyMessage: "조회된 Action이 없습니다.",
                }}
              />
            }
          >
            <ActionsPageContent
              queryStates={queryStates}
              setQueryStates={setQueryStates}
              rightInputs={rightInputs}
            />
          </Suspense>
        </SectionSurface>
      </PageSurface>
    </Page>
  );
});

export default observer(function ActionsPageClient() {
  return (
    <Suspense
      fallback={
        <Page
          top={
            <PageTitleBar
              title="Action 목록"
              description="시스템에 등록된 Action을 조회합니다."
            />
          }
        >
          <PageSurface>
            <SectionSurface>
              <div className="h-32" />
            </SectionSurface>
          </PageSurface>
        </Page>
      }
    >
      <ActionsPageInner />
    </Suspense>
  );
});
