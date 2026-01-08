"use client";

import { Button, Card, CardBody } from "@heroui/react";
import { UserPlus } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
	MemberCardList,
	MemberFilters,
	MemberStatsCards,
	MemberTable,
} from "./_components";
import { MOCK_MEMBERS, MOCK_STATS } from "./_mocks/mockData";
import {
	type Member,
	MemberListStore,
	type MemberRole,
	type MemberStats,
	type MemberStatus,
} from "./_stores";

/**
 * 회원 목록 페이지
 *
 * 현재 목 데이터 사용 중
 * TODO: API 배포 후 실제 API 훅으로 교체
 * - useGetUsers 훅을 사용하여 데이터 조회
 * - Store는 필터, 페이지네이션, 선택 상태만 관리
 */
function MembersPage() {
	const router = useRouter();
	const storeRef = useRef<MemberListStore | null>(null);

	// Store 초기화
	if (!storeRef.current) {
		storeRef.current = new MemberListStore();
	}
	const store = storeRef.current;

	// 목 데이터 상태 (API 대체)
	const [isLoading, setIsLoading] = useState(true);
	const [members, setMembers] = useState<Member[]>([]);
	const [stats, setStats] = useState<MemberStats>(MOCK_STATS);
	const [error, setError] = useState<Error | null>(null);

	// 목 데이터 로드 (API 대체)
	useEffect(() => {
		const loadMockData = async () => {
			setIsLoading(true);
			try {
				// 실제 API 호출처럼 약간의 딜레이 추가
				await new Promise((resolve) => setTimeout(resolve, 500));

				// 필터 적용
				let filteredMembers = [...MOCK_MEMBERS];

				// 검색어 필터
				if (store.filters.search) {
					const searchLower = store.filters.search.toLowerCase();
					filteredMembers = filteredMembers.filter(
						(m) =>
							m.name.toLowerCase().includes(searchLower) ||
							m.email.toLowerCase().includes(searchLower) ||
							m.phone?.includes(store.filters.search),
					);
				}

				// 역할 필터
				if (store.filters.roles.length > 0) {
					filteredMembers = filteredMembers.filter((m) =>
						m.tenants?.some((t) =>
							store.filters.roles.includes(t.role.name as MemberRole),
						),
					);
				}

				setMembers(filteredMembers);
				setStats({
					...MOCK_STATS,
					total: filteredMembers.length,
				});

				// Store 업데이트
				store.pagination.total = filteredMembers.length;
			} catch (err) {
				setError(err as Error);
			} finally {
				setIsLoading(false);
			}
		};

		loadMockData();
	}, [store.filters.search, store.filters.roles, store.filters.status, store]);

	// 이벤트 핸들러들
	const onChangeSearch = (value: string) => {
		store.setSearch(value);
	};

	const onChangeRoleFilter = (roles: MemberRole[]) => {
		store.setRoleFilter(roles);
	};

	const onChangeStatusFilter = (status: MemberStatus | "all") => {
		store.setStatusFilter(status);
	};

	const onClickResetFiltersButton = () => {
		store.resetFilters();
	};

	const onClickSelectAll = () => {
		store.selectAll(members);
	};

	const onClickSelectMember = (id: string) => {
		store.selectMember(id);
	};

	const onClickSort = (field: string) => {
		store.setSorting(field);
	};

	const onClickViewMember = (id: string) => {
		// 동적 라우트 이동 (Next.js 타입 시스템 우회)
		(router.push as (url: string) => void)(`/users/${id}`);
	};

	const onClickEditMember = (id: string) => {
		// TODO: 수정 모달 열기
		console.log("Edit member:", id);
	};

	const onClickDeleteMember = (id: string) => {
		// TODO: 삭제 확인 모달 열기
		console.log("Delete member:", id);
	};

	const onChangePage = (page: number) => {
		store.setPage(page);
	};

	const onClickCreateMemberButton = () => {
		// TODO: 회원 등록 모달 열기
		console.log("Create member");
	};

	return (
		<div className="flex flex-col gap-6 p-4 md:p-6">
			{/* 헤더 */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-1">
					<h1 className="text-2xl font-bold md:text-3xl">회원 관리</h1>
					<p className="text-default-500">회원 정보를 조회하고 관리합니다</p>
				</div>
				<Button
					color="primary"
					startContent={<UserPlus className="h-4 w-4" />}
					onPress={onClickCreateMemberButton}
				>
					<span>회원 등록</span>
				</Button>
			</div>

			{/* 통계 카드 */}
			<MemberStatsCards stats={stats} isLoading={isLoading} />

			{/* 검색 및 필터 */}
			<Card className="border-none shadow-sm">
				<CardBody className="gap-4 p-4">
					<MemberFilters
						filters={store.filters}
						onChangeSearch={onChangeSearch}
						onChangeRoleFilter={onChangeRoleFilter}
						onChangeStatusFilter={onChangeStatusFilter}
						onClickResetButton={onClickResetFiltersButton}
					/>
				</CardBody>
			</Card>

			{/* 에러 표시 */}
			{error && (
				<div className="rounded-lg bg-danger-50 p-4">
					<span className="text-danger">
						데이터를 불러오는 중 오류가 발생했습니다.
					</span>
				</div>
			)}

			{/* 선택된 항목 정보 */}
			{store.selectedCount > 0 && (
				<div className="flex items-center gap-4 rounded-lg bg-primary-50 p-4">
					<span className="font-medium text-primary">
						{store.selectedCount}개 선택됨
					</span>
					<div className="flex gap-2">
						<Button size="sm" variant="flat" color="primary">
							<span>역할 변경</span>
						</Button>
						<Button size="sm" variant="flat" color="danger">
							<span>삭제</span>
						</Button>
					</div>
				</div>
			)}

			{/* 테이블 (데스크톱) / 카드 (모바일) */}
			<div className="hidden md:block">
				<MemberTable
					members={members}
					isLoading={isLoading}
					selectedIds={store.selectedIds}
					isAllSelected={store.isAllSelected(members)}
					isIndeterminate={store.isIndeterminate(members)}
					sorting={store.sorting}
					pagination={store.pagination}
					totalPages={store.totalPages}
					onClickSelectAll={onClickSelectAll}
					onClickSelectMember={onClickSelectMember}
					onClickSort={onClickSort}
					onClickViewMember={onClickViewMember}
					onClickEditMember={onClickEditMember}
					onClickDeleteMember={onClickDeleteMember}
					onChangePage={onChangePage}
				/>
			</div>

			{/* 모바일 카드 뷰 */}
			<div className="block md:hidden">
				<MemberCardList
					members={members}
					selectedIds={store.selectedIds}
					onClickSelect={onClickSelectMember}
					onClickView={onClickViewMember}
					onClickEdit={onClickEditMember}
					onClickDelete={onClickDeleteMember}
				/>
			</div>
		</div>
	);
}

// MobX observer로 래핑하여 상태 변경 감지
export default observer(MembersPage);
