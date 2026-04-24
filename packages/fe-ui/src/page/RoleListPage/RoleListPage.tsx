"use client";

import type {
	MetaDataGridQueryStates,
	MetaDataGridSetQueryStates,
} from "@cocrepo/type";
import {
	buildAdminRoleTableColumns,
	MetaDataGrid,
	PageTitleBar,
	Surface,
	VStack,
} from "@cocrepo/ui";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";

export interface RoleListPageQueryStates extends MetaDataGridQueryStates {
	take: number;
	skip: number;
}
export type RoleListPageSetQueryStates = MetaDataGridSetQueryStates;

export interface RoleListPageRole {
	id: string;
	name: string;
	displayName?: string | null;
	description?: string | null;
	isSystem: boolean;
	createdAt: string | Date | null;
	removedAt?: string | null;
}

export interface RoleListPageProps {
	roles: RoleListPageRole[];
	totalCount: number;
	isLoading: boolean;
	queryStates: RoleListPageQueryStates;
	setQueryStates: RoleListPageSetQueryStates;
	onClickCreateButton: () => void;
}

const RolesPageFallback = observer(() => {
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

export const RoleListPage = observer(({
	roles,
	totalCount,
	isLoading,
	queryStates,
	setQueryStates,
	onClickCreateButton,
}: RoleListPageProps) => {
	const columns = buildAdminRoleTableColumns<RoleListPageRole>();

	if (isLoading) {
		return <RolesPageFallback />;
	}

	return (
		<div className="space-y-5">
			<PageTitleBar
				title="역할 목록"
				description="시스템에 등록된 역할을 관리합니다."
				actions={
					<Button
						color="primary"
						startContent={<Plus className="h-4 w-4" />}
						onPress={onClickCreateButton}
					>
						역할 추가
					</Button>
				}
			/>
			<VStack gap={4}>
				<div className="rounded-xl bg-warning-50 p-4 dark:bg-warning-900/20">
					<p className="text-sm text-warning-700 dark:text-warning-400">
						<strong>참고:</strong> 시스템 역할(FULL_ACCESS, MANAGE, VIEW)은
						수정하거나 삭제할 수 없습니다. 권한 설정은 각 역할의 상세 페이지에서
						관리할 수 있습니다.
					</p>
				</div>
				<div className="space-y-3">
					<PageTitleBar level={2} title="역할 목록 데이터" />
					<Surface className="overflow-hidden rounded-2xl border-divider/80 bg-content1/70">
						<MetaDataGrid
							config={{
								entity: "Role",
								data: roles,
								totalCount,
								isLoading: false,
								queryStates,
								setQueryStates,
								columns,
								emptyMessage: "등록된 역할이 없습니다.",
							}}
						/>
					</Surface>
				</div>
			</VStack>
		</div>
	);
});
