"use client";
import { customInstance } from "@cocrepo/api/core/client";

import { DateTimeCell, Page, PageTitleBar, Section, VStack } from "@cocrepo/ui";
import { Button } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Layers, Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import Link from "next/link";

/** 그룹 응답 타입 (Orval codegen 전 임시) */
interface GroupItem {
	id: string;
	name: string;
	label?: string | null;
	type: string;
	createdAt: string;
	updatedAt: string;
}

/** API 호출 (Orval codegen 전 임시) */
function getGroups() {
	return customInstance<{ data: GroupItem[] }>({
		url: "/api/v1/groups",
		method: "GET",
		params: { type: "Role" },
	});
}

/**
 * 역할 그룹 목록 페이지 - 클라이언트 컴포넌트
 */
function RoleGroupsPageClient() {
	// TODO: Orval codegen 후 useGetGroups({ type: "Role" }) 로 교체
	const { data: response, isLoading } = useQuery({
		queryKey: ["/api/v1/groups", { type: "Role" }],
		queryFn: getGroups,
	});

	const groups = response?.data ?? [];
	const totalCount = groups.length;

	return (
		<Page
			top={
				<PageTitleBar
					title="역할 그룹 목록"
					description="역할을 그룹으로 분류하여 관리합니다."
					actions={
						<Button
							as={Link}
							href="/roles/groups/new"
							color="primary"
							startContent={<Plus className="h-4 w-4" />}
						>
							그룹 추가
						</Button>
					}
				/>
			}
		>
			<VStack gap={4}>
				<Section>
					{isLoading ? (
						<div className="flex items-center justify-center p-8">
							<span className="text-default-500">로딩 중...</span>
						</div>
					) : groups.length === 0 ? (
						<div className="flex flex-col items-center justify-center gap-4 p-16">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
								<Layers className="h-8 w-8 text-primary" />
							</div>
							<p className="text-default-500">등록된 역할 그룹이 없습니다.</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b border-divider">
										<th className="w-[200px] px-4 py-3 text-left font-medium text-default-500">
											그룹명
										</th>
										<th className="w-[200px] px-4 py-3 text-left font-medium text-default-500">
											라벨
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
									{groups.map((group) => (
										<tr
											key={group.id}
											className="border-b border-divider transition-colors hover:bg-content2/50"
										>
											<td className="px-4 py-3">
												<span className="font-mono text-sm">{group.name}</span>
											</td>
											<td className="px-4 py-3">
												<span className="text-default-600">
													{group.label || "-"}
												</span>
											</td>
											<td className="px-4 py-3">
												<DateTimeCell value={group.createdAt} />
											</td>
											<td className="px-4 py-3 text-center">
												<Button
													as={Link}
													href={`/roles/groups/${group.id}`}
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
				</Section>
			</VStack>
		</Page>
	);
}

export default observer(RoleGroupsPageClient);
