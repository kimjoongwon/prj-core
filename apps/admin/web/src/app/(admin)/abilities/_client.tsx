"use client";

import type { AbilityResponseDto } from "@cocrepo/api";
import { customInstance, useGetActions, useGetSubjects } from "@cocrepo/api";
import type { MetaDataGridColumnConfig } from "@cocrepo/type";
import { DateTimeCell, Page, PageTitleBar, Section, VStack } from "@cocrepo/ui";
import {
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Key, Plus, Search } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * 임시 전체 목록 조회 훅 (Orval 재생성 전)
 */
const useGetAllAbilities = () => {
  return useQuery({
    queryKey: ["abilities"],
    queryFn: async () => {
      const response = await customInstance<{
        data: AbilityResponseDto[];
      }>({ url: "/api/v1/abilities", method: "GET" });
      return response;
    },
  });
};

/**
 * 컬럼 정의
 */
const columns: MetaDataGridColumnConfig<AbilityResponseDto>[] = [
  {
    field: "name",
    label: "권한 이름",
    size: 180,
    isRequired: true,
    cell: ({ getValue }) => (
      <span className="font-mono text-sm">{getValue() as string}</span>
    ),
  },
  {
    field: "subject",
    label: "Subject",
    size: 150,
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.subject?.displayName || row.original.subject?.name || "-"}
      </span>
    ),
  },
  {
    field: "action",
    label: "Action",
    size: 120,
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.action?.displayName || row.original.action?.name || "-"}
      </span>
    ),
  },
  {
    field: "inverted",
    label: "유형",
    size: 100,
    align: "center",
    cell: ({ getValue }) => {
      const inverted = getValue() as boolean;
      return (
        <Chip size="sm" color={inverted ? "danger" : "success"} variant="flat">
          {inverted ? "거부(cannot)" : "허용(can)"}
        </Chip>
      );
    },
  },
  {
    field: "fields",
    label: "필드 수",
    size: 80,
    align: "center",
    cell: ({ getValue }) => {
      const fields = getValue() as string[];
      return (
        <span className="text-sm">
          {fields.length === 0 ? "전체" : fields.length}
        </span>
      );
    },
  },
  {
    field: "conditions",
    label: "조건",
    size: 80,
    align: "center",
    cell: ({ getValue }) => {
      const conditions = getValue();
      return (
        <Chip
          size="sm"
          color={conditions ? "primary" : "default"}
          variant="flat"
        >
          {conditions ? "있음" : "없음"}
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
];

/**
 * 권한 목록 페이지 - 클라이언트 컴포넌트
 */
function AbilitiesPageClient() {
  const router = useRouter();

  // 로컬 상태
  const state = useLocalObservable(() => ({
    searchTerm: "",
    selectedSubjectId: "",
    selectedActionId: "",
    selectedInverted: "", // "" | "true" | "false"
  }));

  // API 조회
  const { data: response, isLoading } = useGetAllAbilities();
  const { data: subjectsResponse } = useGetSubjects();
  const { data: actionsResponse } = useGetActions();

  const abilities = response?.data ?? [];
  const subjects = subjectsResponse?.data ?? [];
  const actions = actionsResponse?.data ?? [];

  // 필터링
  const filteredAbilities = abilities.filter((ability: AbilityResponseDto) => {
    // 검색어 필터
    if (
      state.searchTerm &&
      !ability.name.toLowerCase().includes(state.searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Subject 필터
    if (
      state.selectedSubjectId &&
      ability.subjectId !== state.selectedSubjectId
    ) {
      return false;
    }

    // Action 필터
    if (state.selectedActionId && ability.actionId !== state.selectedActionId) {
      return false;
    }

    // inverted 필터
    if (state.selectedInverted !== "") {
      const invertedBool = state.selectedInverted === "true";
      if (ability.inverted !== invertedBool) {
        return false;
      }
    }

    return true;
  });

  const totalCount = filteredAbilities.length;

  /**
   * 행 클릭 핸들러
   */
  const onClickRow = (abilityId: string) => {
    router.push(`/abilities/${abilityId}` as Route);
  };

  /**
   * 필터 초기화
   */
  const onClickResetFilters = () => {
    state.searchTerm = "";
    state.selectedSubjectId = "";
    state.selectedActionId = "";
    state.selectedInverted = "";
  };

  return (
    <Page
      top={
        <PageTitleBar
          title="권한 목록"
          description="시스템에 등록된 CASL 권한을 관리합니다."
          actions={
            <Button
              as={Link}
              href="/abilities/new"
              color="primary"
              startContent={<Plus className="h-4 w-4" />}
            >
              권한 추가
            </Button>
          }
        />
      }
    >
      <VStack gap={4}>
        <Section top={<PageTitleBar level={2} title="필터" />}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Input
              placeholder="권한 이름 검색"
              value={state.searchTerm}
              onValueChange={(value) => {
                state.searchTerm = value;
              }}
              startContent={<Search className="h-4 w-4 text-default-400" />}
              isClearable
              onClear={() => {
                state.searchTerm = "";
              }}
            />
            <Select
              placeholder="Subject 선택"
              selectedKeys={
                state.selectedSubjectId ? [state.selectedSubjectId] : []
              }
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                state.selectedSubjectId = selected || "";
              }}
            >
              {subjects.map((subject) => (
                <SelectItem key={subject.id}>
                  {subject.displayName || subject.name}
                </SelectItem>
              ))}
            </Select>
            <Select
              placeholder="Action 선택"
              selectedKeys={
                state.selectedActionId ? [state.selectedActionId] : []
              }
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                state.selectedActionId = selected || "";
              }}
            >
              {actions.map((action) => (
                <SelectItem key={action.id}>
                  {action.displayName || action.name}
                </SelectItem>
              ))}
            </Select>
            <Select
              placeholder="유형 선택"
              selectedKeys={
                state.selectedInverted ? [state.selectedInverted] : []
              }
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                state.selectedInverted = selected || "";
              }}
            >
              <SelectItem key="false">허용(can)</SelectItem>
              <SelectItem key="true">거부(cannot)</SelectItem>
            </Select>
          </div>
          <div className="mt-2 flex justify-end">
            <Button size="sm" variant="flat" onPress={onClickResetFilters}>
              필터 초기화
            </Button>
          </div>
        </Section>
        <Section top={<PageTitleBar level={2} title="권한 목록" />}>
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 p-8">
              <Spinner size="sm" />
              <span className="text-default-500">로딩 중...</span>
            </div>
          ) : filteredAbilities.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 p-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Key className="h-8 w-8 text-primary" />
              </div>
              <p className="text-default-500">
                {abilities.length === 0
                  ? "등록된 권한이 없습니다."
                  : "검색 조건에 맞는 권한이 없습니다."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-divider">
                    {columns.map((column) => (
                      <th
                        key={column.field}
                        className={`px-4 py-3 text-left font-medium text-default-500 ${column.align === "center" ? "text-center" : ""}`}
                        style={{ width: column.size }}
                      >
                        {column.label}
                      </th>
                    ))}
                    <th className="w-[100px] px-4 py-3 text-center font-medium text-default-500">
                      액션
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAbilities.map((ability: AbilityResponseDto) => (
                    <tr
                      key={ability.id}
                      className="cursor-pointer border-b border-divider transition-colors hover:bg-content2/50"
                      onClick={() => onClickRow(ability.id)}
                    >
                      {columns.map((column) => {
                        const cellFn = column.cell;
                        const value =
                          ability[column.field as keyof AbilityResponseDto];
                        return (
                          <td
                            key={column.field}
                            className={`px-4 py-3 ${column.align === "center" ? "text-center" : ""}`}
                          >
                            {typeof cellFn === "function"
                              ? cellFn({
                                  getValue: () => value,
                                  row: { original: ability },
                                } as never)
                              : String(value ?? "-")}
                          </td>
                        );
                      })}
                      <td className="px-4 py-3 text-center">
                        <Button
                          as={Link}
                          href={`/abilities/${ability.id}`}
                          size="sm"
                          variant="flat"
                          onClick={(event) => event.stopPropagation()}
                        >
                          상세
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-3 text-sm text-default-500">
                총 {totalCount}건
              </div>
            </div>
          )}
        </Section>
      </VStack>
    </Page>
  );
}

export default observer(AbilitiesPageClient);
