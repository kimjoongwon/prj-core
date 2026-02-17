"use client";

// TODO: Orval codegen 후 아래 import로 교체
// import { useGetCategories, type CategoryDto } from "@cocrepo/api";
import { customInstance } from "@cocrepo/api";
import {
	DateTimeCell,
	PageSurface,
	ParentCategoryCell,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import { Button } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { FolderTree, Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import Link from "next/link";

/** 카테고리 응답 타입 (Orval codegen 전 임시) */
interface CategoryItem {
	id: string;
	name: string;
	type: string;
	parentId?: string | null;
	parent?: { id: string; name: string } | null;
	children?: Array<{ id: string; name: string }>;
	createdAt: string;
	updatedAt: string;
}

/** API 호출 (Orval codegen 전 임시) */
function getCategories() {
	return customInstance<{ data: CategoryItem[] }>({
		url: "/api/v1/categories",
		method: "GET",
		params: { type: "Role" },
	});
}

/**
 * 역할 카테고리 목록 페이지 - 클라이언트 컴포넌트
 */
function RoleCategoriesPageClient() {
	// TODO: Orval codegen 후 useGetCategories({ type: "Role" }) 로 교체
	const { data: response, isLoading } = useQuery({
		queryKey: ["/api/v1/categories", { type: "Role" }],
		queryFn: getCategories,
	});

	const categories = response?.data ?? [];
	const totalCount = categories.length;

	return (
		<PageSurface
			title="역할 카테고리 목록"
			description="역할을 카테고리로 분류하여 관리합니다."
			actions={
				<Button
					as={Link}
					href="/roles/categories/new"
					color="primary"
					startContent={<Plus className="h-4 w-4" />}
				>
					카테고리 추가
				</Button>
			}
		>
			<VStack gap={4}>
				<SectionSurface>
					{isLoading ? (
						<div className="flex items-center justify-center p-8">
							<span className="text-default-500">로딩 중...</span>
						</div>
					) : categories.length === 0 ? (
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
										<th className="px-4 py-3 text-left font-medium text-default-500 w-[200px]">
											카테고리명
										</th>
										<th className="px-4 py-3 text-left font-medium text-default-500 w-[180px]">
											상위 카테고리
										</th>
										<th className="px-4 py-3 text-center font-medium text-default-500 w-[120px]">
											하위 카테고리 수
										</th>
										<th className="px-4 py-3 text-left font-medium text-default-500 w-[150px]">
											생성일
										</th>
										<th className="px-4 py-3 text-center font-medium text-default-500 w-[100px]">
											액션
										</th>
									</tr>
								</thead>
								<tbody>
									{categories.map((category) => (
										<tr
											key={category.id}
											className="border-b border-divider hover:bg-content2/50 transition-colors"
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
													{category.children?.length ?? 0}
												</span>
											</td>
											<td className="px-4 py-3">
												<DateTimeCell value={category.createdAt} />
											</td>
											<td className="px-4 py-3 text-center">
												<Button
													as={Link}
													href={`/roles/categories/${category.id}`}
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

export default observer(RoleCategoriesPageClient);
