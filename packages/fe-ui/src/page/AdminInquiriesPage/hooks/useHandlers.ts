import { ADMIN_PATHS } from "@cocrepo/constant";
import type { Route } from "next";
import type { useRouter } from "next/navigation";

type InquiriesQuerySetter = (
	values: Record<string, unknown | null>,
	options?: { history?: "push" | "replace" },
) => Promise<URLSearchParams>;

const FILTERABLE_INQUIRY_STATUSES = new Set([
	"NEW",
	"IN_PROGRESS",
	"WAITING_CUSTOMER",
	"RESOLVED",
	"CLOSED",
]);

interface UseHandlersProps {
	router: ReturnType<typeof useRouter>;
	setQueryStates: InquiriesQuerySetter;
}

interface UseHandlersReturn {
	onClickNewInquiry: () => void;
	onClickInquiryRow: (inquiryId: string) => void;
	onClickStatusFilter: (status: string | undefined) => void;
}

/**
 * 문의 목록 페이지 이벤트 핸들러 훅
 */
export function useHandlers({
	router,
	setQueryStates,
}: UseHandlersProps): UseHandlersReturn {
	const onClickNewInquiry = () => {
		router.push(ADMIN_PATHS.INQUIRIES_NEW as Route);
	};

	const onClickInquiryRow = (inquiryId: string) => {
		router.push(
			ADMIN_PATHS.INQUIRIES_DETAIL.replace("[inquiryId]", inquiryId) as Route,
		);
	};

	const onClickStatusFilter = (status: string | undefined) => {
		const inquiryStatus =
			typeof status === "string" && FILTERABLE_INQUIRY_STATUSES.has(status)
				? status
				: null;

		void setQueryStates({
			inquiryStatus,
			skip: 0,
		});
	};

	return {
		onClickNewInquiry,
		onClickInquiryRow,
		onClickStatusFilter,
	};
}
