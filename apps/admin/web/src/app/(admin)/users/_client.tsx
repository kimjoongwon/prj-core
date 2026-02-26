"use client";

import { type UserDto, useGetUsers } from "@cocrepo/api";
import type { InputConfig, MetaDataGridColumnConfig } from "@cocrepo/type";
import {
	DateTimeCell,
	MetaDataGrid,
	PageSurface,
	PhoneCell,
	SectionSurface,
	StatsCard,
	StatusChipCell,
	UserRoleCell,
	useMetaDataGridQueryStates,
	VStack,
} from "@cocrepo/ui";
import { UserCheck, UserMinus, Users } from "lucide-react";
import { observer } from "mobx-react-lite";

/**
 * 컬럼 정의
 */
const columns: MetaDataGridColumnConfig<UserDto>[] = [
	{
		field: "name",
		label: "이름",
		size: 150,
		isRequired: true,
	},
	{
		field: "email",
		label: "이메일",
		size: 200,
	},
	{
		field: "phone",
		label: "전화번호",
		size: 150,
		cell: ({ getValue }) => <PhoneCell value={getValue() as string} />,
	},
	{
		field: "role",
		label: "역할",
		size: 120,
		align: "center",
		cell: ({ row }) => <UserRoleCell tenants={row.original.tenants} />,
	},
	{
		field: "status",
		label: "상태",
		size: 100,
		align: "center",
		cell: ({ row }) => <StatusChipCell removedAt={row.original.removedAt} />,
	},
	{
		field: "createdAt",
		label: "가입일",
		size: 150,
		cell: ({ getValue }) => <DateTimeCell value={getValue() as string} />,
	},
];

/**
 * 좌측 입력 정의 (검색)
 */
const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "이름, 이메일, 전화번호로 검색...",
		props: {
			debounceMs: 300,
		},
	},
];

/**
 * 회원 목록 페이지 - 클라이언트 컴포넌트
 */
function UsersPageClient() {
	// nuqs 기반 URL 상태 관리
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(leftInputs);

	// API 조회
	const { data: response, isLoading } = useGetUsers({
		take: queryStates.take,
		skip: queryStates.skip,
		name: queryStates.search || undefined,
	});

	const users = response?.data ?? [];
	const meta = response?.meta;
	const stats = response?.stats;
	const totalCount = meta?.total ?? 0;

	return (
		<PageSurface
			title="이용자 목록"
			description="시스템에 등록된 이용자를 조회합니다."
		>
			<VStack gap={4}>
				{/* 통계 카드 */}
				{stats && (
					<SectionSurface>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
							<StatsCard
								title="전체 이용자"
								value={stats.total ?? 0}
								icon={<Users className="size-5" />}
								color="primary"
							/>
							<StatsCard
								title="활성 이용자"
								value={stats.active ?? 0}
								icon={<UserCheck className="size-5" />}
								color="success"
							/>
							<StatsCard
								title="비활성 이용자"
								value={stats.inactive ?? 0}
								icon={<UserMinus className="size-5" />}
								color="default"
							/>
						</div>
					</SectionSurface>
				)}

				{/* MetaDataGrid */}
				<SectionSurface>
					<MetaDataGrid
						config={{
							entity: "User",
							data: users,
							totalCount,
							isLoading,
							queryStates,
							setQueryStates,
							columns,
							leftInputs,
							emptyMessage: "조회된 이용자가 없습니다.",
						}}
					/>
				</SectionSurface>
			</VStack>
		</PageSurface>
	);
}

export default observer(UsersPageClient);
