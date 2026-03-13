"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Chip,
	Link,
	Skeleton,
} from "@heroui/react";
import { observer } from "mobx-react-lite";

export interface GroupRoleItem {
	id: string;
	roleId: string;
	role?: {
		id: string;
		name: string;
		displayName?: string | null;
		isSystem: boolean;
	};
}

export interface GroupRoleListSectionProps {
	/** 소속 역할 목록 */
	roleAssociations: GroupRoleItem[];
	/** 로딩 상태 */
	isLoading?: boolean;
	/** 역할 상세 링크 기본 경로 */
	rolesBasePath?: string;
}

/**
 * GroupRoleListSection 컴포넌트
 * 그룹에 소속된 역할 목록을 읽기 전용 테이블로 표시합니다.
 */
export const GroupRoleListSection = observer(
	({
		roleAssociations,
		isLoading = false,
		rolesBasePath = "/roles",
	}: GroupRoleListSectionProps) => {
		if (isLoading) {
			return (
				<div className="flex flex-col gap-2 p-2">
					<Skeleton className="h-8 w-full rounded-lg" />
					<Skeleton className="h-8 w-full rounded-lg" />
					<Skeleton className="h-8 w-full rounded-lg" />
				</div>
			);
		}

		if (roleAssociations.length === 0) {
			return (
				<div className="flex flex-col items-center justify-center py-8 text-default-400">
					<p className="text-sm">이 그룹에 소속된 역할이 없습니다.</p>
				</div>
			);
		}

		return (
			<Table aria-label="소속 역할 목록" removeWrapper>
				<TableHeader>
					<TableColumn>역할 식별자</TableColumn>
					<TableColumn>표시명</TableColumn>
					<TableColumn>시스템</TableColumn>
				</TableHeader>
				<TableBody>
					{roleAssociations.map((item) => (
						<TableRow key={item.id}>
							<TableCell>
								{item.role ? (
									<Link href={`${rolesBasePath}/${item.role.id}`} size="sm">
										{item.role.name}
									</Link>
								) : (
									<span className="text-default-400">-</span>
								)}
							</TableCell>
							<TableCell>{item.role?.displayName || "-"}</TableCell>
							<TableCell>
								<Chip
									size="sm"
									variant="flat"
									color={item.role?.isSystem ? "success" : "default"}
								>
									{item.role?.isSystem ? "예" : "아니오"}
								</Chip>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		);
	},
);
