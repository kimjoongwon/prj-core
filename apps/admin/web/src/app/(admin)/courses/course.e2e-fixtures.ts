import { mockAdminShell } from "@cocrepo/e2e";
import type { Page } from "@playwright/test";

const spaceId = "space-gangnam";

const course = {
	id: "course-pilates-basic",
	createdAt: "2026-05-01T00:00:00.000Z",
	updatedAt: "2026-05-01T00:00:00.000Z",
	removedAt: null,
	spaceId,
	name: "초급 필라테스",
	description: "입문자가 장비와 기본 호흡, 코어 안정화를 배우는 과정",
	durationMonths: 6,
	basePriceAmount: 450000,
	currency: "KRW",
	status: "ACTIVE",
	activeOfferingCount: 1,
	activeEnrollmentCount: 1,
};

const space = {
	id: spaceId,
	createdAt: "2026-05-01T00:00:00.000Z",
	updatedAt: "2026-05-01T00:00:00.000Z",
	removedAt: null,
	contentLanguageCode: "ko",
	ground: {
		id: "ground-gangnam",
		createdAt: "2026-05-01T00:00:00.000Z",
		updatedAt: "2026-05-01T00:00:00.000Z",
		removedAt: null,
		name: "강남점",
		description: null,
	},
};

const timeline = {
	id: "timeline-mon-wed-fri-1900",
	createdAt: "2026-05-01T00:00:00.000Z",
	updatedAt: "2026-05-01T00:00:00.000Z",
	removedAt: null,
	name: "월수금 19:00",
	description: null,
	spaceId,
	creatorId: "user-admin",
};

const user = {
	id: "user-kim",
	createdAt: "2026-05-01T00:00:00.000Z",
	updatedAt: "2026-05-01T00:00:00.000Z",
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

const offering = {
	id: "offering-gangnam-2026-h1",
	createdAt: "2026-05-01T00:00:00.000Z",
	updatedAt: "2026-05-01T00:00:00.000Z",
	removedAt: null,
	courseId: course.id,
	spaceId,
	timelineId: timeline.id,
	timelineProvisioningMode: "SHARED",
	name: "강남점 2026 상반기 6개월반",
	startsAt: "2026-05-01T00:00:00.000Z",
	endsAt: "2026-10-31T00:00:00.000Z",
	enrollmentStartsAt: "2026-04-01T00:00:00.000Z",
	enrollmentEndsAt: "2026-05-31T00:00:00.000Z",
	capacity: 48,
	enrolledCount: 38,
	status: "ACTIVE",
	course,
	space,
	timeline,
};

const pass = {
	id: "pass-kim",
	createdAt: "2026-05-01T00:00:00.000Z",
	updatedAt: "2026-05-01T00:00:00.000Z",
	removedAt: null,
	enrollmentId: "enrollment-kim",
	userId: user.id,
	courseId: course.id,
	courseOfferingId: offering.id,
	timelineId: timeline.id,
	kind: "STANDARD",
	issuedAt: "2026-05-01T00:00:00.000Z",
	validFrom: "2026-05-01T00:00:00.000Z",
	expiresAt: "2026-10-31T00:00:00.000Z",
	reservationLimit: 48,
	reservationUsedCount: 12,
	reservationRemainingCount: 36,
	status: "ACTIVE",
	user,
	course,
	courseOffering: offering,
	timeline,
};

const enrollment = {
	id: "enrollment-kim",
	createdAt: "2026-05-01T00:00:00.000Z",
	updatedAt: "2026-05-01T00:00:00.000Z",
	removedAt: null,
	userId: user.id,
	courseId: course.id,
	courseOfferingId: offering.id,
	coursePassId: pass.id,
	assignedTimelineId: timeline.id,
	paymentStatus: "PAID",
	paymentProvider: "manual",
	paymentExternalId: "payment-kim",
	paidAt: "2026-05-01T00:00:00.000Z",
	paidAmount: 450000,
	currency: "KRW",
	validFrom: "2026-05-01T00:00:00.000Z",
	validUntil: "2026-10-31T00:00:00.000Z",
	status: "ACTIVE",
	user,
	course,
	courseOffering: offering,
	assignedTimeline: timeline,
	coursePass: pass,
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

interface MockCourseApiOptions {
	empty?: boolean;
}

export const mockCourseApi = async (
	page: Page,
	options: MockCourseApiOptions = {},
) => {
	await mockAdminShell(page, {
		spaceId,
		groundName: "강남점",
	});
	await page.route("**/api/v1/courses**", async (route) => {
		const url = new URL(route.request().url());
		const courses = options.empty ? [] : [course];
		const offerings = options.empty ? [] : [offering];
		const enrollments = options.empty ? [] : [enrollment];
		const passes = options.empty ? [] : [pass];

		if (url.pathname.endsWith("/api/v1/courses/offerings")) {
			await route.fulfill({ json: toListResponse(offerings) });
			return;
		}

		if (url.pathname.endsWith("/api/v1/courses/enrollments")) {
			await route.fulfill({ json: toListResponse(enrollments) });
			return;
		}

		if (url.pathname.endsWith("/api/v1/courses/passes")) {
			await route.fulfill({ json: toListResponse(passes) });
			return;
		}

		if (url.pathname.endsWith("/api/v1/courses")) {
			await route.fulfill({ json: toListResponse(courses) });
			return;
		}

		await route.fallback();
	});
};
