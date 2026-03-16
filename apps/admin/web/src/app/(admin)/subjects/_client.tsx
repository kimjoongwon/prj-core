"use client";

import {
  type SubjectDto,
  useGetSubjectsSuspense,
} from "@cocrepo/api/core/subjects";
import type { InputConfig, MetaDataGridColumnConfig } from "@cocrepo/type";
import {
  BooleanCell,
  DateTimeCell,
  DefaultCell,
  MetaDataGrid,
  Page,
  PageSurface,
  PageTitleBar,
  SectionSurface,
  useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import { Chip } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { Suspense } from "react";

const GROUP_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "entity", label: "Entity" },
  { value: "menu", label: "Menu" },
  { value: "feature", label: "Feature" },
  { value: "ui", label: "UI" },
];

function getGroupColor(
  group?: string,
): "primary" | "secondary" | "success" | "warning" | "default" {
  switch (group) {
    case "entity":
      return "primary";
    case "menu":
      return "secondary";
    case "feature":
      return "success";
    case "ui":
      return "warning";
    default:
      return "default";
  }
}

const columns: MetaDataGridColumnConfig<SubjectDto>[] = [
  {
    field: "name",
    label: "식별자",
    size: 200,
    isRequired: true,
  },
  {
    field: "displayName",
    label: "표시명",
    size: 150,
    cell: ({ getValue }) => {
      const value = getValue() as string | undefined;
      return <DefaultCell value={value || "-"} />;
    },
  },
  {
    field: "group",
    label: "분류",
    size: 120,
    align: "center",
    cell: ({ getValue }) => {
      const group = getValue() as string | undefined;
      return group ? (
        <Chip color={getGroupColor(group)} size="sm" variant="flat">
          {group}
        </Chip>
      ) : (
        <DefaultCell value="-" />
      );
    },
  },
  {
    field: "isSystem",
    label: "시스템",
    size: 100,
    align: "center",
    cell: ({ getValue }) => <BooleanCell value={getValue() as boolean} />,
  },
  {
    field: "order",
    label: "정렬 순서",
    size: 100,
    align: "center",
  },
  {
    field: "createdAt",
    label: "생성일",
    size: 150,
    cell: ({ getValue }) => <DateTimeCell value={getValue() as string} />,
  },
];

const leftInputs: InputConfig[] = [
  {
    type: "search",
    id: "search",
    placeholder: "식별자, 표시명으로 검색...",
    props: {
      debounceMs: 300,
    },
  },
];

const rightInputs: InputConfig[] = [
  {
    type: "select",
    id: "group",
    placeholder: "분류",
    props: {
      options: GROUP_OPTIONS,
    },
  },
];

type SubjectsQueryStates = ReturnType<typeof useMetaDataGridQueryStates>[0];
type SetSubjectsQueryStates = ReturnType<typeof useMetaDataGridQueryStates>[1];

function filterSubjects(
  subjects: SubjectDto[],
  queryStates: SubjectsQueryStates,
) {
  return subjects.filter((subject) => {
    if (queryStates.search) {
      const searchLower = queryStates.search.toLowerCase();
      const nameMatch = subject.name?.toLowerCase().includes(searchLower);
      const displayNameMatch = subject.displayName
        ?.toLowerCase()
        .includes(searchLower);
      if (!nameMatch && !displayNameMatch) return false;
    }

    if (queryStates.group && queryStates.group !== "all") {
      if (subject.group !== queryStates.group) return false;
    }

    return true;
  });
}

const SubjectsPageContent = observer(function SubjectsPageContent({
  queryStates,
  setQueryStates,
}: {
  queryStates: SubjectsQueryStates;
  setQueryStates: SetSubjectsQueryStates;
}) {
  const { data: response } = useGetSubjectsSuspense();
  const subjects = response?.data ?? [];
  const filteredSubjects = filterSubjects(subjects, queryStates);

  return (
    <MetaDataGrid
      config={{
        entity: "Subject",
        data: filteredSubjects,
        totalCount: filteredSubjects.length,
        isLoading: false,
        queryStates,
        setQueryStates,
        columns,
        leftInputs,
        rightInputs,
        emptyMessage: "조회된 Subject가 없습니다.",
      }}
    />
  );
});

const SubjectsPageInner = observer(function SubjectsPageInner() {
  const [queryStates, setQueryStates] = useMetaDataGridQueryStates([
    ...leftInputs,
    ...rightInputs,
  ]);

  return (
    <Page
      top={
        <PageTitleBar
          title="Subject 목록"
          description="시스템에 등록된 Subject를 조회합니다."
        />
      }
    >
      <PageSurface>
        <SectionSurface padding="none">
          <Suspense
            fallback={
              <MetaDataGrid
                config={{
                  entity: "Subject",
                  data: [],
                  totalCount: 0,
                  isLoading: true,
                  queryStates,
                  setQueryStates,
                  columns,
                  leftInputs,
                  rightInputs,
                  emptyMessage: "조회된 Subject가 없습니다.",
                }}
              />
            }
          >
            <SubjectsPageContent
              queryStates={queryStates}
              setQueryStates={setQueryStates}
            />
          </Suspense>
        </SectionSurface>
      </PageSurface>
    </Page>
  );
});

export default observer(function SubjectsPageClient() {
  return (
    <Suspense
      fallback={
        <Page
          top={
            <PageTitleBar
              title="Subject 목록"
              description="시스템에 등록된 Subject를 조회합니다."
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
      <SubjectsPageInner />
    </Suspense>
  );
});
