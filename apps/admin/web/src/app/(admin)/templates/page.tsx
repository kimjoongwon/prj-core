"use client";

import {
  getGetTemplatesQueryKey,
  type TemplateDto,
  useGetTemplatesSuspense,
  useToggleTemplateStatus,
} from "@cocrepo/api/core/templates";
import type { InputConfig, MetaDataGridColumnConfig } from "@cocrepo/type";
import {
  DateTimeCell,
  MetaDataGrid,
  Page,
  PageSurface,
  PageTitleBar,
  SectionSurface,
  TemplateActiveToggleCell,
  TemplateTypeChipCell,
  useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import { addToast, Button } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

/**
 * 좌측 입력 정의 (검색 + 유형 필터 + 상태 필터)
 */
const leftInputs: InputConfig[] = [
  {
    type: "search",
    id: "search",
    placeholder: "이름, 코드로 검색...",
    props: {
      debounceMs: 300,
    },
  },
  {
    type: "select",
    id: "type",
    placeholder: "유형",
    props: {
      options: [
        { label: "전체", value: "" },
        { label: "이메일", value: "EMAIL" },
        { label: "SMS", value: "SMS" },
        { label: "푸시", value: "PUSH" },
      ],
    },
  },
  {
    type: "select",
    id: "isActive",
    placeholder: "상태",
    props: {
      options: [
        { label: "전체", value: "" },
        { label: "활성", value: "true" },
        { label: "비활성", value: "false" },
      ],
    },
  },
];

type TemplatesQueryStates = ReturnType<typeof useMetaDataGridQueryStates>[0];
type SetTemplatesQueryStates = ReturnType<typeof useMetaDataGridQueryStates>[1];

function buildColumns({
  onClickTemplateCode,
  onToggleTemplateStatusSwitch,
}: {
  onClickTemplateCode: (template: TemplateDto) => void;
  onToggleTemplateStatusSwitch: (templateId: string) => Promise<void>;
}): MetaDataGridColumnConfig<TemplateDto>[] {
  return [
    {
      field: "code",
      label: "코드",
      size: 180,
      isRequired: true,
      cell: ({ getValue, row }) => (
        <button
          type="button"
          className="text-primary hover:underline cursor-pointer text-left"
          onClick={() => onClickTemplateCode(row.original as TemplateDto)}
        >
          {getValue() as string}
        </button>
      ),
    },
    {
      field: "name",
      label: "이름",
      size: 200,
    },
    {
      field: "type",
      label: "유형",
      size: 100,
      align: "center",
      cell: ({ getValue }) => (
        <TemplateTypeChipCell type={getValue() as "EMAIL" | "SMS" | "PUSH"} />
      ),
    },
    {
      field: "isActive",
      label: "활성",
      size: 80,
      align: "center",
      cell: ({ row }) => (
        <TemplateActiveToggleCell
          isActive={(row.original as TemplateDto).isActive}
          templateId={(row.original as TemplateDto).id}
          onToggle={onToggleTemplateStatusSwitch}
        />
      ),
    },
    {
      field: "description",
      label: "설명",
      size: 250,
      cell: ({ getValue }) => (
        <span className="text-default-500 text-sm line-clamp-1">
          {(getValue() as string) || "-"}
        </span>
      ),
    },
    {
      field: "createdAt",
      label: "등록일",
      size: 150,
      cell: ({ getValue }) => <DateTimeCell value={getValue() as string} />,
    },
  ];
}

function getTemplatesParams(queryStates: TemplatesQueryStates) {
  return {
    take: queryStates.take,
    skip: queryStates.skip,
    search: queryStates.search || undefined,
    type: queryStates.type || undefined,
    isActive:
      queryStates.isActive === "true"
        ? true
        : queryStates.isActive === "false"
          ? false
          : undefined,
  };
}

const TemplatesGridContent = observer(function TemplatesGridContent({
  queryStates,
  setQueryStates,
  columns,
}: {
  queryStates: TemplatesQueryStates;
  setQueryStates: SetTemplatesQueryStates;
  columns: MetaDataGridColumnConfig<TemplateDto>[];
}) {
  const { data: response } = useGetTemplatesSuspense(
    getTemplatesParams(queryStates),
  );

  const templates = (response?.data ?? []) as TemplateDto[];
  const totalCount = response?.meta?.total ?? 0;

  return (
    <MetaDataGrid
      config={{
        entity: "Template",
        data: templates,
        totalCount,
        isLoading: false,
        queryStates,
        setQueryStates,
        columns,
        leftInputs,
        emptyMessage: "등록된 템플릿이 없습니다.",
      }}
    />
  );
});

const TemplatesPageInner = observer(function TemplatesPageInner() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [queryStates, setQueryStates] = useMetaDataGridQueryStates(leftInputs);
  const toggleMutation = useToggleTemplateStatus();

  const onToggleTemplateStatusSwitch = async (templateId: string) => {
    try {
      await toggleMutation.mutateAsync({ templateId });
      await queryClient.invalidateQueries({
        queryKey: getGetTemplatesQueryKey(),
      });
      addToast({
        title: "상태 변경 완료",
        description: "템플릿 활성 상태가 변경되었습니다.",
        color: "success",
      });
    } catch {
      addToast({
        title: "상태 변경 실패",
        description: "템플릿 상태 변경 중 오류가 발생했습니다.",
        color: "danger",
      });
      throw new Error("토글 실패");
    }
  };

  const onClickTemplateCode = (template: TemplateDto) => {
    router.push(`/templates/${template.id}`);
  };

  const columns = buildColumns({
    onClickTemplateCode,
    onToggleTemplateStatusSwitch,
  });

  const createTemplateButton = (
    <Button
      as={Link}
      href="/templates/new"
      color="primary"
      startContent={<Plus className="h-4 w-4" />}
    >
      템플릿 등록
    </Button>
  );

  return (
    <Page
      top={
        <PageTitleBar
          title="메시지 템플릿"
          description="시스템에 등록된 메시지 템플릿을 관리합니다."
          actions={createTemplateButton}
        />
      }
    >
      <PageSurface>
        <SectionSurface padding="none">
          <Suspense
            fallback={
              <MetaDataGrid
                config={{
                  entity: "Template",
                  data: [],
                  totalCount: 0,
                  isLoading: true,
                  queryStates,
                  setQueryStates,
                  columns,
                  leftInputs,
                  emptyMessage: "등록된 템플릿이 없습니다.",
                }}
              />
            }
          >
            <TemplatesGridContent
              queryStates={queryStates}
              setQueryStates={setQueryStates}
              columns={columns}
            />
          </Suspense>
        </SectionSurface>
      </PageSurface>
    </Page>
  );
});

const TemplatesPageClient = observer(function TemplatesPageClient() {
  return (
    <Suspense
      fallback={
        <Page
          top={
            <PageTitleBar
              title="메시지 템플릿"
              description="시스템에 등록된 메시지 템플릿을 관리합니다."
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
      <TemplatesPageInner />
    </Suspense>
  );
});

const TemplatesPage = dynamic(Promise.resolve(TemplatesPageClient), {
  ssr: false,
  loading: () => (
    <Page
      top={
        <PageTitleBar
          title="메시지 템플릿"
          description="시스템에 등록된 메시지 템플릿을 관리합니다."
        />
      }
    >
      <PageSurface>
        <SectionSurface>
          <div className="h-32" />
        </SectionSurface>
      </PageSurface>
    </Page>
  ),
});

export default TemplatesPage;
