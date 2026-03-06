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

export interface CategoryRoleItem {
	id: string;
	roleId: string;
	role?: {
		id: string;
		name: string;
		displayName?: string | null;
		isSystem: boolean;
	};
}

export interface CategoryRoleListSectionProps {
	/** 분류된 역할 목록 */
	roleClassifications: CategoryRoleItem[];
	/** 로딩 상태 */
	isLoading?: boolean;
	/** 역할 상세 링크 기본 경로 */
	rolesBasePath?: string;
}

/**
 * CategoryRoleListSection 컴포넌트
 * 카테고리에 분류된 역할 목록을 읽기 전용 테이블로 표시합니다.
 */
export const CategoryRoleListSection = observer(
	({
		roleClassifications,
		isLoading = false,
		rolesBasePath = "/roles",
	}: CategoryRoleListSectionProps) => {
		if (isLoading) {
			return (
				<div className="flex flex-col gap-2 p-2">
					<Skeleton className="h-8 w-full rounded-lg" />
					<Skeleton className="h-8 w-full rounded-lg" />
					<Skeleton className="h-8 w-full rounded-lg" />
				</div>
			);
		}

		if (roleClassifications.length === 0) {
			return (
				<div className="flex flex-col items-center justify-center py-8 text-default-400">
					<p className="text-sm">이 카테고리에 분류된 역할이 없습니다.</p>
				</div>
			);
		}

		return (
			<Table aria-label="분류된 역할 목록" removeWrapper>
				<TableHeader>
					<TableColumn>역할 식별자</TableColumn>
					<TableColumn>표시명</TableColumn>
					<TableColumn>시스템</TableColumn>
				</TableHeader>
				<TableBody>
					{roleClassifications.map((item) => (
						<TableRow key={item.id}>
							<TableCell>
								{item.role ? (
									<Link
										href={`${rolesBasePath}/${item.role.id}`}
										size="sm"
									>
										{item.role.name}
									</Link>
								) : (
									<span className="text-default-400">-</span>
								)}
							</TableCell>
							<TableCell>
								{item.role?.displayName || "-"}
							</TableCell>
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
