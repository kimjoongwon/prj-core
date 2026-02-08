"use client";

import { customInstance } from "@cocrepo/api";
import type { UserDto } from "@cocrepo/dto";
import { DeleteFilter } from "@cocrepo/enum";

/**
 * 회원 목록 API 응답 타입
 */
interface UserListResponse {
	data: UserDto[];
	meta?: {
		total: number;
		totalPages: number;
	};
	stats?: {
		total: number;
		active: number;
		inactive: number;
		newThisMonth: number;
	};
}
import { Button, Pagination } from "@heroui/react";
import { Plus } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { UserSearchWidget, UserTableWidget } from "../../../widgets/user";

/**
 * 회원 목록 Feature Props
 */
export interface UserListProps {
	/** 상태 필터 (탭별) */
	statusFilter?: DeleteFilter;
	/** 신규 등록 버튼 클릭 핸들러 */
	onNewClick?: () => void;
}

/**
 * 회원 목록 Feature 컴포넌트
 *
 * API 호출과 상태 관리가 포함된 회원 목록 Feature입니다.
 * - 검색 기능
 * - 페이지네이션
 * - 상태별 필터링
 */
export const UserList = observer(
	({ statusFilter, onNewClick }: UserListProps) => {
		const router = useRouter();
		const searchParams = useSearchParams();

		// URL에서 초기값 읽기
		const initialPage = Number(searchParams.get("page")) || 1;
		const initialSearch = searchParams.get("search") || "";

		const state = useLocalObservable(() => ({
			users: [] as UserDto[],
			isLoading: false,
			error: null as string | null,
			search: initialSearch,
			page: initialPage,
			limit: 20,
			total: 0,
			totalPages: 0,
			stats: {
				total: 0,
				active: 0,
				inactive: 0,
				newThisMonth: 0,
			},
		}));

		/**
		 * 회원 목록 로드
		 */
		const loadUsers = async () => {
			state.isLoading = true;
			state.error = null;

			try {
				const params = new URLSearchParams();
				if (state.search) params.set("search", state.search);
				if (statusFilter) params.set("status", statusFilter);
				params.set("page", String(state.page));
				params.set("limit", String(state.limit));

				const response = await customInstance<{ data: UserListResponse }>({
					url: `/api/v1/users?${params.toString()}`,
					method: "GET",
				});

				const result = response.data;
				state.users = result.data ?? [];
				state.total = result.meta?.total ?? 0;
				state.totalPages = result.meta?.totalPages ?? 0;
				if (result.stats) {
					state.stats = result.stats;
				}
			} catch (err) {
				state.error =
					err instanceof Error
						? err.message
						: "회원 목록을 불러오는데 실패했습니다";
			} finally {
				state.isLoading = false;
			}
		};

		// 페이지, 검색어, 필터 변경 시 데이터 로드
		useEffect(() => {
			loadUsers();
		}, [state.page, statusFilter]);

		/**
		 * 검색 실행
		 */
		const handleSearch = () => {
			state.page = 1; // 검색 시 첫 페이지로
			loadUsers();
			// URL 업데이트
			const params = new URLSearchParams();
			if (state.search) params.set("search", state.search);
			params.set("page", "1");
			router.replace(`?${params.toString()}`);
		};

		/**
		 * 페이지 변경
		 */
		const handlePageChange = (page: number) => {
			state.page = page;
			// URL 업데이트
			const params = new URLSearchParams(searchParams.toString());
			params.set("page", String(page));
			router.replace(`?${params.toString()}`);
		};

		/**
		 * 행 클릭 (상세 페이지 이동)
		 */
		const handleRowClick = (user: UserDto) => {
			router.push(`/users/${user.id}` as never);
		};

		/**
		 * 수정 버튼 클릭
		 */
		const handleEditClick = (user: UserDto) => {
			router.push(`/users/${user.id}/edit` as never);
		};

		/**
		 * 삭제 버튼 클릭
		 */
		const handleDeleteClick = async (user: UserDto) => {
			if (!confirm(`${user.name} 회원을 삭제하시겠습니까?`)) return;

			try {
				await customInstance({
					url: `/api/v1/users/${user.id}`,
					method: "DELETE",
				});
				// 목록 새로고침
				loadUsers();
			} catch {
				alert("회원 삭제에 실패했습니다");
			}
		};

		return (
			<div className="space-y-4">
				{/* 검색 및 등록 버튼 */}
				<div className="flex items-center justify-between">
					<UserSearchWidget
						value={state.search}
						onChange={(v) => {
							state.search = v;
						}}
						onSearch={handleSearch}
						isLoading={state.isLoading}
					/>
					{onNewClick && (
						<Button
							color="primary"
							startContent={<Plus className="h-4 w-4" />}
							onPress={onNewClick}
						>
							회원 등록
						</Button>
					)}
				</div>

				{/* 에러 메시지 */}
				{state.error && (
					<div className="rounded-xl bg-danger-50 p-4">
						<p className="text-sm text-danger-700">{state.error}</p>
					</div>
				)}

				{/* 회원 테이블 */}
				<UserTableWidget
					users={state.users}
					isLoading={state.isLoading}
					onRowClick={handleRowClick}
					onEditClick={handleEditClick}
					onDeleteClick={handleDeleteClick}
				/>

				{/* 페이지네이션 */}
				{state.totalPages > 1 && (
					<div className="flex justify-center">
						<Pagination
							total={state.totalPages}
							page={state.page}
							onChange={handlePageChange}
							showControls
						/>
					</div>
				)}
			</div>
		);
	},
);

UserList.displayName = "UserList";
