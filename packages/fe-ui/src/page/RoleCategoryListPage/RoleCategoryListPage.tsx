"use client";

import type { CategoryDto } from "@cocrepo/api/core/model";
import { DateTimeCell, PageTitleBar, Surface } from "@cocrepo/ui";
import { Button } from "@heroui/react";
import { FolderTree, Plus } from "lucide-react";
import { observer } from "mobx-react-lite";

export interface RoleCategoryListPageProps {
	categories?: CategoryDto[];
	isLoading: boolean;
	onClickCreateButton: () => void;
	onClickDetailButton: (categoryId: string) => void;
}

function ParentCategoryCell({ parentName }: { parentName?: string | null }) {
	if (!parentName) {
		return <span className="text-default-400">루트 카테고리</span>;
	}
	return <span className="text-default-600">{parentName}</span>;
}

function getChildrenCount(category: CategoryDto) {
	return Array.isArray(category.children) ? category.children.length : 0;
}

export const RoleCategoryListPage = observer(
	({
		categories,
		isLoading,
		onClickCreateButton,
		onClickDetailButton,
	}: RoleCategoryListPageProps) => {
		const categoryRows = categories ?? [];
		const totalCount = categoryRows.length;

		return (
			<div className="space-y-5">
				<PageTitleBar
					title="역할 카테고리 목록"
					description="역할을 카테고리로 분류하여 관리합니다."
					actions={
						<Button
							color="primary"
							startContent={<Plus className="h-4 w-4" />}
							onPress={onClickCreateButton}
						>
							카테고리 추가
						</Button>
					}
				/>
				<Surface className="overflow-hidden rounded-2xl border-divider/80 bg-content1/70">
					{isLoading ? (
						<div className="flex items-center justify-center p-8">
							<span className="text-default-500">로딩 중...</span>
						</div>
					) : categoryRows.length === 0 ? (
						<div className="flex flex-col items-center justify-center gap-4 p-16">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
								<FolderTree className="h-8 w-8 text-primary" />
							</div>
							<p className="text-default-500">
								등록된 역할 카테고리가 없습니다.
							</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b border-divider">
										<th className="w-[200px] px-4 py-3 text-left font-medium text-default-500">
											카테고리명
										</th>
										<th className="w-[180px] px-4 py-3 text-left font-medium text-default-500">
											상위 카테고리
										</th>
										<th className="w-[120px] px-4 py-3 text-center font-medium text-default-500">
											하위 카테고리 수
										</th>
										<th className="w-[150px] px-4 py-3 text-left font-medium text-default-500">
											생성일
										</th>
										<th className="w-[100px] px-4 py-3 text-center font-medium text-default-500">
											액션
										</th>
									</tr>
								</thead>
								<tbody>
									{categoryRows.map((category) => (
										<tr
											key={category.id}
											className="border-b border-divider transition-colors hover:bg-content2/50"
										>
											<td className="px-4 py-3">
												<span className="font-mono text-sm">
													{category.name}
												</span>
											</td>
											<td className="px-4 py-3">
												<ParentCategoryCell
													parentName={category.parent?.name}
												/>
											</td>
											<td className="px-4 py-3 text-center">
												<span className="text-default-600">
													{getChildrenCount(category)}
												</span>
											</td>
											<td className="px-4 py-3">
												<DateTimeCell value={category.createdAt} />
											</td>
											<td className="px-4 py-3 text-center">
												<Button
													size="sm"
													variant="flat"
													onPress={() => onClickDetailButton(category.id)}
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
				</Surface>
			</div>
		);
	},
);
