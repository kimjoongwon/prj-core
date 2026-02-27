import type { InquiryStore } from "@cocrepo/store";
import type { InquiryRow } from "@cocrepo/ui";
import type { Route } from "next";
import type { useRouter, useSearchParams } from "next/navigation";

// TODO: Orval 훅 생성 후 아래 import 추가
// import { useGetInquiries, useGetInquiryStats } from "@cocrepo/api";
// import type { InquiryDto, InquiryStatsDto } from "@cocrepo/api";

interface UseHandlersProps {
	state: {
		page: number;
		pageSize: number;
		sortField: string;
		sortDirection: "asc" | "desc";
		isLoading: boolean;
	};
	inquiryStore: InquiryStore;
	router: ReturnType<typeof useRouter>;
	searchParams: ReturnType<typeof useSearchParams>;
}

interface UseHandlersReturn {
	onClickNewInquiry: () => void;
	onClickInquiryRow: (inquiry: InquiryRow) => void;
	onClickStatusFilter: (status: string | undefined) => void;
	onPageChange: (page: number) => void;
	onSort: (field: string, direction: "asc" | "desc") => void;
	onSearch: (keyword: string) => void;
	onResetFilters: () => void;
	onRefresh: () => void;
}

/**
 * 문의 목록 페이지 이벤트 핸들러 훅
 *
 * React 19+ 및 MobX 사용 시 useCallback/useMemo 불필요
 * observer가 자동으로 필요한 리렌더링만 처리
 *
 * @requires Orval API 훅 생성 후 refetch 연동 필요:
 * const { refetch } = useGetInquiries({ ... });
 */
export function useHandlers({
	state,
	inquiryStore,
	router,
	searchParams,
}: UseHandlersProps): UseHandlersReturn {
	// TODO: Orval 훅 생성 후 refetch 훅 추가
	// const { refetch } = useGetInquiries({ ... });

	/**
	 * 새 문의 접수 버튼 클릭
	 */
	const onClickNewInquiry = () => {
		router.push("/inquiries/new" as Route);
	};

	/**
	 * 문의 행 클릭 - 상세 페이지 이동
	 */
	const onClickInquiryRow = (inquiry: InquiryRow) => {
		inquiryStore.selectInquiry(inquiry.id);
		router.push(`/inquiries/${inquiry.id}` as Route);
	};

	/**
	 * 상태 필터 클릭
	 */
	const onClickStatusFilter = (status: string | undefined) => {
		if (status === undefined) {
			inquiryStore.setFilterStatus(null);
		} else {
			inquiryStore.setFilterStatus(status as InquiryStore["filterStatus"]);
		}
		// 페이지 초기화
		state.page = 1;

		// URL 쿼리 파라미터 업데이트
		const params = new URLSearchParams(searchParams.toString());
		if (status) {
			params.set("status", status);
		} else {
			params.delete("status");
		}
		params.set("page", "1");
		router.push(`?${params.toString()}`);
	};

	/**
	 * 페이지 변경
	 */
	const onPageChange = (page: number) => {
		state.page = page;

		// URL 쿼리 파라미터 업데이트
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", String(page));
		router.push(`?${params.toString()}`);
	};

	/**
	 * 정렬 변경
	 */
	const onSort = (field: string, direction: "asc" | "desc") => {
		state.sortField = field;
		state.sortDirection = direction;

		// URL 쿼리 파라미터 업데이트
		const params = new URLSearchParams(searchParams.toString());
		params.set("sortField", field);
		params.set("sortDirection", direction);
		router.push(`?${params.toString()}`);
	};

	/**
	 * 검색
	 */
	const onSearch = (keyword: string) => {
		inquiryStore.setSearchKeyword(keyword);
		state.page = 1;

		// URL 쿼리 파라미터 업데이트
		const params = new URLSearchParams(searchParams.toString());
		if (keyword) {
			params.set("search", keyword);
		} else {
			params.delete("search");
		}
		params.set("page", "1");
		router.push(`?${params.toString()}`);
	};

	/**
	 * 필터 초기화
	 */
	const onResetFilters = () => {
		inquiryStore.clearAllFilters();
		state.page = 1;
		state.sortField = "createdAt";
		state.sortDirection = "desc";

		// URL 쿼리 파라미터 초기화
		router.push("/inquiries" as Route);
	};

	/**
	 * 새로고침
	 *
	 * @requires Orval API 훅 생성 후 refetch 호출로 변경:
	 * state.isLoading = true;
	 * await refetch();
	 * state.isLoading = false;
	 */
	const onRefresh = () => {
		state.isLoading = true;
		// TODO: Orval 훅 생성 후 refetch 호출
		// await refetch();
		setTimeout(() => {
			state.isLoading = false;
		}, 500);
	};

	return {
		onClickNewInquiry,
		onClickInquiryRow,
		onClickStatusFilter,
		onPageChange,
		onSort,
		onSearch,
		onResetFilters,
		onRefresh,
	};
}
