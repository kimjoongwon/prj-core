"use client";

import { useGetRolesSuspense } from "@cocrepo/api/core/roles";
import {
	adminRoleTableColumns,
	MetaDataGrid,
	PageTitleBar,
	Surface,
	useMetaDataGridQueryStates,
	VStack,
} from "@cocrepo/ui";
import { Button } from "@heroui/react";
import { Plus, Shield } from "lucide-react";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { Suspense } from "react";

type RolesQueryStates = ReturnType<typeof useMetaDataGridQueryStates>[0];
type SetRolesQueryStates = ReturnType<typeof useMetaDataGridQueryStates>[1];

const RolesTableContent = observer(function RolesTableContent({
	queryStates,
	setQueryStates,
}: {
	queryStates: RolesQueryStates;
	setQueryStates: SetRolesQueryStates;
}) {
	const { data: response } = useGetRolesSuspense();
	const roles = response?.data ?? [];

	return (
		<MetaDataGrid
			config={{
				entity: "Role",
				data: roles,
				totalCount: roles.length,
				isLoading: false,
				queryStates,
				setQueryStates,
				columns: adminRoleTableColumns,
				emptyMessage: "등록된 역할이 없습니다.",
			}}
		/>
	);
});

const RolesPageFallback = observer(function RolesPageFallback() {
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
});

export const AdminRolesPage = observer(function RolesPage() {
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates();
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
									<MetaDataGrid
										config={{
											entity: "Role",
											data: [],
											totalCount: 0,
											isLoading: true,
											queryStates,
											setQueryStates,
											columns: adminRoleTableColumns,
											emptyMessage: "등록된 역할이 없습니다.",
										}}
									/>
								}
							>
								<RolesTableContent
									queryStates={queryStates}
									setQueryStates={setQueryStates}
								/>
							</Suspense>
						</Surface>
					</div>
				</VStack>
			</div>
		</Suspense>
	);
});

export default AdminRolesPage;
