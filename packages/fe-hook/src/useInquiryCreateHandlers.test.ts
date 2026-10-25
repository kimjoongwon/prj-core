import { ADMIN_PATHS } from "@cocrepo/constant";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	type InquiryCreateFormData,
	useInquiryCreateHandlers,
} from "./useInquiryCreateHandlers";

const mutateAsync = vi.fn();

vi.mock("@cocrepo/api/core/inquiries", () => ({
	InquiryCategory: {
		GENERAL: "GENERAL",
		DELIVERY: "DELIVERY",
		REFUND: "REFUND",
		PRODUCT: "PRODUCT",
		ACCOUNT: "ACCOUNT",
		TECHNICAL: "TECHNICAL",
		COMPLAINT: "COMPLAINT",
		OTHER: "OTHER",
	},
	InquiryChannel: {
		WEB: "WEB",
		EMAIL: "EMAIL",
		CHAT: "CHAT",
		SMS: "SMS",
		PHONE: "PHONE",
		WALK_IN: "WALK_IN",
	},
	InquiryPriority: {
		LOW: "LOW",
		NORMAL: "NORMAL",
		HIGH: "HIGH",
		URGENT: "URGENT",
	},
	useCreateInquiry: () => ({ mutateAsync }),
}));

const CUSTOMER_ID = "01JCSTMR0000000000000000CS";
const ASSIGNEE_ID = "01JASGNEE000000000000000AS";
const CREATED_INQUIRY_ID = "01JCREATED00000000000000CR";

describe("useInquiryCreateHandlers", () => {
	const inquiryFormData: InquiryCreateFormData = {
		customerId: CUSTOMER_ID,
		title: "배송 문의",
		content: "배송 상태를 확인해주세요.",
		category: "DELIVERY",
		channel: "WEB",
		priority: "HIGH",
		assigneeId: ASSIGNEE_ID,
	};

	beforeEach(() => {
		mutateAsync.mockReset();
	});

	it("문자열 ULID 식별자를 요청 DTO로 그대로 전달하고 생성된 ULID로 이동한다", async () => {
		const state = {
			isSubmitting: false,
			aiSuggestion: null,
			isAiLoading: false,
		};
		const router = { push: vi.fn() };
		mutateAsync.mockResolvedValue({ data: { id: CREATED_INQUIRY_ID } });

		const { onSubmit } = useInquiryCreateHandlers({ state, router });

		await onSubmit(inquiryFormData);

		expect(mutateAsync).toHaveBeenCalledWith({
			data: {
				customerId: CUSTOMER_ID,
				title: "배송 문의",
				content: "배송 상태를 확인해주세요.",
				category: "DELIVERY",
				channel: "WEB",
				priority: "HIGH",
				assigneeId: ASSIGNEE_ID,
			},
		});
		expect(router.push).toHaveBeenCalledWith(
			ADMIN_PATHS.INQUIRIES_DETAIL.replace("[inquiryId]", CREATED_INQUIRY_ID),
		);
		expect(state.isSubmitting).toBe(false);
	});
});
