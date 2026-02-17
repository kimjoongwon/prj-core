"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Link,
	Skeleton,
} from "@heroui/react";
import { observer } from "mobx-react-lite";

export interface CategoryChildItem {
	id: string;
	name: string;
	_count?: {
		roleClassifications?: number;
	};
}

export interface CategoryChildrenSectionProps {
	/** 하위 카테고리 목록 */
	children: CategoryChildItem[];
	/** 로딩 상태 */
	isLoading?: boolean;
	/** 카테고리 상세 링크 기본 경로 */
	categoriesBasePath?: string;
}

/**
 * CategoryChildrenSection 컴포넌트
 * 하위 카테고리 목록을 읽기 전용 테이블로 표시합니다.
 */
export const CategoryChildrenSection = observer(
	({
		children: childCategories,
		isLoading = false,
		categoriesBasePath = "/roles/categories",
	}: CategoryChildrenSectionProps) => {
		if (isLoading) {
			return (
				<div className="flex flex-col gap-2 p-2">
					<Skeleton className="h-8 w-full rounded-lg" />
					<Skeleton className="h-8 w-full rounded-lg" />
				</div>
			);
		}

		if (childCategories.length === 0) {
			return (
				<div className="flex flex-col items-center justify-center py-8 text-default-400">
					<p className="text-sm">하위 카테고리가 없습니다.</p>
				</div>
			);
		}

		return (
			<Table aria-label="하위 카테고리 목록" removeWrapper>
				<TableHeader>
					<TableColumn>이름</TableColumn>
					<TableColumn>분류된 역할 수</TableColumn>
				</TableHeader>
				<TableBody>
					{childCategories.map((child) => (
						<TableRow key={child.id}>
							<TableCell>
								<Link
									href={`${categoriesBasePath}/${child.id}`}
									size="sm"
								>
									{child.name}
								</Link>
							</TableCell>
							<TableCell>
								{child._count?.roleClassifications?.toLocaleString() ?? "0"}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		);
	},
);
