"use client";

import { useGetRoles, type RoleDto } from "@cocrepo/api";
import type { MetaDataGridColumnConfig } from "@cocrepo/type";
import {
  DateTimeCell,
  PageSurface,
  SectionSurface,
  StatusChipCell,
  VStack,
} from "@cocrepo/ui";
import { Button, Chip } from "@heroui/react";
import { Plus, Shield } from "lucide-react";
import { observer } from "mobx-react-lite";
import Link from "next/link";

/**
 * 컬럼 정의
 */
const columns: MetaDataGridColumnConfig<RoleDto>[] = [
  {
    field: "name",
    label: "역할 식별자",
    size: 180,
    isRequired: true,
    cell: ({ getValue, row }) => (
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm">{getValue() as string}</span>
        {row.original.isSystem && (
          <Chip size="sm" color="warning" variant="flat">
            시스템
          </Chip>
        )}
      </div>
    ),
  },
  {
    field: "displayName",
    label: "표시명",
    size: 150,
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
    field: "status",
    label: "상태",
    size: 100,
    align: "center",
    cell: ({ row }) => <StatusChipCell removedAt={row.original.removedAt} />,
  },
  {
    field: "createdAt",
    label: "생성일",
    size: 150,
    cell: ({ getValue }) => <DateTimeCell value={getValue() as string} />,
  },
];

/**
 * 역할 목록 페이지 - 클라이언트 컴포넌트
 */
function RolesPageClient() {
  // API 조회
  const { data: response, isLoading } = useGetRoles();

  const roles = response?.data ?? [];
  const totalCount = roles.length;

  return (
    <PageSurface
      title="역할 목록"
      description="시스템에 등록된 역할을 관리합니다."
      actions={
        <Button
          as={Link}
          href="/roles/new"
          color="primary"
          startContent={<Plus className="h-4 w-4" />}
        >
          역할 추가
        </Button>
      }
    >
      <VStack gap={4}>
        {/* 안내 메시지 */}
        <div className="rounded-xl bg-warning-50 dark:bg-warning-900/20 p-4">
          <p className="text-sm text-warning-700 dark:text-warning-400">
            <strong>참고:</strong> 시스템 역할(SUPER_ADMIN, ADMIN, USER)은
            수정하거나 삭제할 수 없습니다. 권한 설정은 각 역할의 상세 페이지에서
            관리할 수 있습니다.
          </p>
        </div>

        {/* 역할 목록 테이블 */}
        <SectionSurface>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <span className="text-default-500">로딩 중...</span>
            </div>
          ) : roles.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 p-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <p className="text-default-500">등록된 역할이 없습니다.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-divider">
                    {columns.map((col) => (
                      <th
                        key={col.field}
                        className={`px-4 py-3 text-left font-medium text-default-500 ${
                          col.align === "center" ? "text-center" : ""
                        }`}
                        style={{ width: col.size }}
                      >
                        {col.label}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center font-medium text-default-500 w-[100px]">
                      액션
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr
                      key={role.id}
                      className="border-b border-divider hover:bg-content2/50 transition-colors"
                    >
                      {columns.map((col) => {
                        const cellFn = col.cell;
                        const value = role[col.field as keyof RoleDto];
                        return (
                          <td
                            key={col.field}
                            className={`px-4 py-3 ${
                              col.align === "center" ? "text-center" : ""
                            }`}
                          >
                            {typeof cellFn === "function"
                              ? cellFn({
                                  getValue: () => value,
                                  row: { original: role },
                                } as never)
                              : String(value ?? "-")}
                          </td>
                        );
                      })}
                      <td className="px-4 py-3 text-center">
                        <Button
                          as={Link}
                          href={`/roles/${role.id}`}
                          size="sm"
                          variant="flat"
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
        </SectionSurface>
      </VStack>
    </PageSurface>
  );
}

export default observer(RolesPageClient);
