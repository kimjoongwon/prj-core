"use client";

import { useGetRolesSuspense } from "@cocrepo/api/core/roles";
import {
	adminRoleTableColumns,
	PageTitleBar,
	Surface,
	VStack,
} from "@cocrepo/ui";
import { Button } from "@heroui/react";
import { Plus, Shield } from "lucide-react";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { Suspense } from "react";

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
						{adminRoleTableColumns.map((column) => (
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
							{adminRoleTableColumns.map((column) => (
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

function RolesPageFallback() {
	return (
		<div className="space-y-5">
			<PageTitleBar
				title="역할 목록"
				description="시스템에 등록된 역할을 관리합니다."
			/>
			<Surface className="h-32 rounded-2xl border-divider/80 bg-content1/70">
				{null}
			</Surface>
		</div>
	);
}

export const AdminRolesPage = observer(function RolesPage() {
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
		<Suspense fallback={<RolesPageFallback />}>
			<div className="space-y-5">
				<PageTitleBar
					title="역할 목록"
					description="시스템에 등록된 역할을 관리합니다."
					actions={createRoleButton}
				/>
				<VStack gap={4}>
					<div className="rounded-xl bg-warning-50 p-4 dark:bg-warning-900/20">
						<p className="text-sm text-warning-700 dark:text-warning-400">
							<strong>참고:</strong> 시스템 역할(FULL_ACCESS, MANAGE, VIEW)은
							수정하거나 삭제할 수 없습니다. 권한 설정은 각 역할의 상세
							페이지에서 관리할 수 있습니다.
						</p>
					</div>
					<div className="space-y-3">
						<PageTitleBar level={2} title="역할 목록 데이터" />
						<Surface className="overflow-hidden rounded-2xl border-divider/80 bg-content1/70">
							<Suspense
								fallback={
									<div className="flex items-center justify-center p-8">
										<span className="text-default-500">로딩 중...</span>
									</div>
								}
							>
								<RolesTableContent />
							</Suspense>
						</Surface>
					</div>
				</VStack>
			</div>
		</Suspense>
	);
});

export default AdminRolesPage;
