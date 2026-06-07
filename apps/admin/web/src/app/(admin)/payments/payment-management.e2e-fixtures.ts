import { mockAdminShell } from "@cocrepo/e2e";
import type { Page } from "@playwright/test";

const spaceId = "space-gangnam";

const space = {
	id: spaceId,
	createdAt: "2026-05-10T00:00:00.000Z",
	updatedAt: "2026-05-10T00:00:00.000Z",
	removedAt: null,
	contentLanguageCode: "ko",
	ground: {
		id: "ground-gangnam",
		createdAt: "2026-05-10T00:00:00.000Z",
		updatedAt: "2026-05-10T00:00:00.000Z",
		removedAt: null,
		name: "강남점",
		description: null,
	},
};

const payer = {
	id: "user-kim",
	createdAt: "2026-05-10T00:00:00.000Z",
	updatedAt: "2026-05-10T00:00:00.000Z",
	removedAt: null,
	spaceId,
	email: "kim@example.com",
	name: "김철수",
	phone: "010-0000-0000",
	password: "",
	failedLoginAttempts: 0,
	lockedUntil: null,
	isPermanentlyLocked: false,
	mustChangePassword: false,
	passwordChangedAt: null,
	lastLoginAt: null,
	lastLoginIp: null,
	isActive: true,
};

const payment = {
	id: "payment-course-kim",
	createdAt: "2026-05-10T00:00:00.000Z",
	updatedAt: "2026-05-10T00:00:00.000Z",
	removedAt: null,
	spaceId,
	payerUserId: payer.id,
	title: "강남점 2026 상반기 6개월반 결제",
	status: "PAID",
	method: "CARD",
	provider: "toss",
	providerPaymentId: "pay_20260510_kim",
	providerOrderId: "order_20260510_kim",
	totalAmount: 450000,
	currency: "KRW",
	requestedAt: "2026-05-10T09:00:00.000Z",
	approvedAt: "2026-05-10T09:01:00.000Z",
	canceledAt: null,
	receiptUrl: "https://example.com/receipt/pay_20260510_kim",
	memo: null,
	space,
	payer,
	subjects: [
		{
			id: "payment-subject-course",
			createdAt: "2026-05-10T00:00:00.000Z",
			updatedAt: "2026-05-10T00:00:00.000Z",
			removedAt: null,
			paymentId: "payment-course-kim",
			spaceId,
			serviceCode: "course",
			subjectType: "COURSE_OFFERING",
			subjectId: "offering-gangnam-2026-h1",
			subjectLabel: "강남점 2026 상반기 6개월반",
			quantity: 1,
			unitAmount: 450000,
			totalAmount: 450000,
			currency: "KRW",
		},
	],
	references: [
		{
			id: "payment-reference-enrollment",
			createdAt: "2026-05-10T00:00:00.000Z",
			updatedAt: "2026-05-10T00:00:00.000Z",
			removedAt: null,
			paymentId: "payment-course-kim",
			spaceId,
			serviceCode: "course",
			referenceType: "ENROLLMENT",
			referenceId: "enrollment-kim",
			role: "entitlement",
			label: "김철수의 6개월 수강권",
		},
	],
};

const toListResponse = (data: unknown[]) => ({
	httpStatus: 200,
	message: "OK",
	data,
	meta: {
		total: data.length,
		skip: 0,
		take: 50,
		totalPages: 1,
	},
	stats: {
		total: data.length,
	},
});

interface MockPaymentManagementApiOptions {
	empty?: boolean;
}

export const mockPaymentManagementApi = async (
	page: Page,
	options: MockPaymentManagementApiOptions = {},
) => {
	await mockAdminShell(page, {
		spaceId,
		groundName: "강남점",
	});
	await page.route("**/api/v1/payments**", async (route) => {
		const payments = options.empty ? [] : [payment];

		await route.fulfill({ json: toListResponse(payments) });
	});
};
