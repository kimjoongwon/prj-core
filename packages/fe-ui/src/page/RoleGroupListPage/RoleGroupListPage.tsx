"use client";

import { DateTimeCell, PageTitleBar, Surface } from "@cocrepo/ui";
import { Button } from "@heroui/react";
import { Layers, Plus } from "lucide-react";
import { observer } from "mobx-react-lite";

export interface RoleGroupListPageGroup {
	id: string;
	name: string;
	label?: string | null;
	createdAt: string;
}

export interface RoleGroupListPageProps {
	groups: RoleGroupListPageGroup[];
	isLoading: boolean;
	onClickCreateButton: () => void;
	onClickDetailButton: (groupId: string) => void;
}

export const RoleGroupListPage = observer(
	({
		groups,
		isLoading,
		onClickCreateButton,
		onClickDetailButton,
	}: RoleGroupListPageProps) => {
		const totalCount = groups.length;

		return (
			<div className="space-y-5">
				<PageTitleBar
					title="역할 그룹 목록"
					description="역할을 그룹으로 분류하여 관리합니다."
					actions={
						<Button
							color="primary"
							startContent={<Plus className="h-4 w-4" />}
							onPress={onClickCreateButton}
						>
							그룹 추가
						</Button>
					}
				/>
				<Surface className="overflow-hidden rounded-2xl border-divider/80 bg-content1/70">
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
													size="sm"
													variant="flat"
													onPress={() => onClickDetailButton(group.id)}
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
