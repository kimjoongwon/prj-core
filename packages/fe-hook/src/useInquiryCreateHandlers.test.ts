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

describe("useInquiryCreateHandlers", () => {
	const inquiryFormData: InquiryCreateFormData = {
		customerId: "9007199254740993",
		title: "배송 문의",
		content: "배송 상태를 확인해주세요.",
		category: "DELIVERY",
		channel: "WEB",
		priority: "HIGH",
		assigneeId: "9007199254740995",
	};

	beforeEach(() => {
		mutateAsync.mockReset();
	});

	it("문자열 ID를 bigint 요청 DTO로 변환하고 생성된 bigint ID로 이동한다", async () => {
		const state = {
			isSubmitting: false,
			aiSuggestion: null,
			isAiLoading: false,
		};
		const router = { push: vi.fn() };
		mutateAsync.mockResolvedValue({ data: { id: BigInt("9007199254740997") } });

		const { onSubmit } = useInquiryCreateHandlers({ state, router });

		await onSubmit(inquiryFormData);

		expect(mutateAsync).toHaveBeenCalledWith({
			data: {
				customerId: BigInt("9007199254740993"),
				title: "배송 문의",
				content: "배송 상태를 확인해주세요.",
				category: "DELIVERY",
				channel: "WEB",
				priority: "HIGH",
				assigneeId: BigInt("9007199254740995"),
			},
		});
		expect(router.push).toHaveBeenCalledWith(
			ADMIN_PATHS.INQUIRIES_DETAIL.replace("[inquiryId]", "9007199254740997"),
		);
		expect(state.isSubmitting).toBe(false);
	});
});
