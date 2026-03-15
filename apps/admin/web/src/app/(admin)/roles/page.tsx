"use client";

import { type RoleDto, useGetRolesSuspense } from "@cocrepo/api/core/roles";
import {
  DateTimeCell,
  Page,
  PageSurface,
  PageTitleBar,
  Section,
  SectionSurface,
  StatusChipCell,
  VStack,
} from "@cocrepo/ui";
import { Button, Chip } from "@heroui/react";
import { Plus, Shield } from "lucide-react";
import { observer } from "mobx-react-lite";
import dynamic from "next/dynamic";
import Link from "next/link";
import { type ReactNode, Suspense } from "react";

interface RoleColumn {
  field: string;
  label: string;
  size: number;
  align?: "center";
  cell: (role: RoleDto) => ReactNode;
}

const columns: RoleColumn[] = [
  {
    field: "name",
    label: "역할 식별자",
    size: 180,
    cell: (role: RoleDto) => (
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm">{role.name}</span>
        {role.isSystem && (
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
    cell: (role: RoleDto) => role.displayName ?? "-",
  },
  {
    field: "description",
    label: "설명",
    size: 250,
    cell: (role: RoleDto) => (
      <span className="text-default-500 text-sm line-clamp-1">
        {role.description || "-"}
      </span>
    ),
  },
  {
    field: "status",
    label: "상태",
    size: 100,
    align: "center",
    cell: (role: RoleDto) => <StatusChipCell removedAt={role.removedAt} />,
  },
  {
    field: "createdAt",
    label: "생성일",
    size: 150,
    cell: (role: RoleDto) => <DateTimeCell value={role.createdAt} />,
  },
] as const;

const RolesTableContent = observer(function RolesTableContent() {
  const { data: response } = useGetRolesSuspense();
  const roles = response?.data ?? [];

  if (roles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <p className="text-default-500">등록된 역할이 없습니다.</p>
      </div>
    );
  }

  return (
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
          {roles.map((role) => (
            <tr
              key={role.id}
              className="border-b border-divider transition-colors hover:bg-content2/50"
            >
              {columns.map((column) => (
                <td
                  key={column.field}
                  className={`px-4 py-3 ${column.align === "center" ? "text-center" : ""}`}
                >
                  {column.cell(role)}
                </td>
              ))}
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
        총 {roles.length}건
      </div>
    </div>
  );
});

const RolesPageClient = observer(function RolesPageClient() {
  const createRoleButton = (
    <Button
      as={Link}
      href="/roles/new"
      color="primary"
      startContent={<Plus className="h-4 w-4" />}
    >
      역할 추가
    </Button>
  );

  return (
    <Page
      top={
        <PageTitleBar
          title="역할 목록"
          description="시스템에 등록된 역할을 관리합니다."
          actions={createRoleButton}
        />
      }
    >
      <PageSurface>
        <VStack gap={4}>
          <div className="rounded-xl bg-warning-50 p-4 dark:bg-warning-900/20">
            <p className="text-sm text-warning-700 dark:text-warning-400">
              <strong>참고:</strong> 시스템 역할(FULL_ACCESS, MANAGE, VIEW)은
              수정하거나 삭제할 수 없습니다. 권한 설정은 각 역할의 상세
              페이지에서 관리할 수 있습니다.
            </p>
          </div>
          <Section top={<PageTitleBar level={2} title="역할 목록 데이터" />}>
            <SectionSurface padding="none">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center p-8">
                    <span className="text-default-500">로딩 중...</span>
                  </div>
                }
              >
                <RolesTableContent />
              </Suspense>
            </SectionSurface>
          </Section>
        </VStack>
      </PageSurface>
    </Page>
  );
});

const RolesPage = dynamic(Promise.resolve(RolesPageClient), {
  ssr: false,
  loading: () => (
    <Page
      top={
        <PageTitleBar
          title="역할 목록"
          description="시스템에 등록된 역할을 관리합니다."
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

export default RolesPage;
