"use client";

import {
	type CourseDto,
	type CourseOfferingDto,
	type CoursePassDto,
	type EnrollmentDto,
	useGetCourseOfferings,
	useGetCoursePasses,
	useGetCourses,
	useGetEnrollments,
} from "@cocrepo/api/core/courses";

type StatusTone = "success" | "warning" | "danger" | "default";

export interface CourseDataCourse {
	id: string;
	name: string;
	description: string;
	durationLabel: string;
	priceLabel: string;
	activeOfferingCount: number;
	activeEnrollmentCount: number;
	statusLabel: string;
	statusTone: StatusTone;
}

export interface CourseDataOffering {
	id: string;
	courseName: string;
	name: string;
	spaceLabel: string;
	periodLabel: string;
	timelineName: string;
	timelineHref: string;
	capacity: number;
	enrolledCount: number;
	statusLabel: string;
	statusTone: StatusTone;
}

export interface CourseDataEnrollment {
	id: string;
	studentName: string;
	courseName: string;
	offeringName: string;
	paymentLabel: string;
	validityLabel: string;
	reservationSummary: string;
	statusLabel: string;
	statusTone: StatusTone;
}

export interface CourseDataPass {
	id: string;
	holderName: string;
	courseName: string;
	passLabel: string;
	issuedAtLabel: string;
	expiresAtLabel: string;
	remainingReservationLabel: string;
	statusLabel: string;
	statusTone: StatusTone;
}

export interface CourseDataSection {
	id: "courses" | "course-offerings" | "enrollments" | "course-passes";
	label: string;
	description: string;
	href: string;
	count: number;
	tone: "success" | "primary" | "secondary" | "warning";
}

const currencyFormatter = new Intl.NumberFormat("ko-KR", {
	style: "currency",
	currency: "KRW",
	maximumFractionDigits: 0,
});

/**
 * API 날짜 문자열을 관리 화면 표시용 날짜로 변환합니다.
 */
function getDateLabel(value?: string | null) {
	if (!value) return "미정";

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "미정";

	const year = date.getFullYear();
	const month = `${date.getMonth() + 1}`.padStart(2, "0");
	const day = `${date.getDate()}`.padStart(2, "0");

	return `${year}.${month}.${day}`;
}

/**
 * 시작/종료 날짜를 기간 라벨로 변환합니다.
 */
function getPeriodLabel(startsAt?: string | null, endsAt?: string | null) {
	return `${getDateLabel(startsAt)} - ${getDateLabel(endsAt)}`;
}

/**
 * API status 값을 UI tone으로 정규화합니다.
 */
function getStatusTone(status?: string): StatusTone {
	if (status === "ACTIVE" || status === "PAID" || status === "ENROLLING") {
		return "success";
	}
	if (status === "DRAFT" || status === "PENDING" || status === "SUSPENDED") {
		return "warning";
	}
	if (status === "CANCELED" || status === "FAILED") {
		return "danger";
	}
	return "default";
}

const courseStatusLabels: Record<string, string> = {
	DRAFT: "초안",
	ACTIVE: "운영중",
	ARCHIVED: "보관",
};

const offeringStatusLabels: Record<string, string> = {
	DRAFT: "초안",
	ENROLLING: "모집중",
	ACTIVE: "운영중",
	CLOSED: "종료",
	CANCELED: "취소",
};

const enrollmentStatusLabels: Record<string, string> = {
	PENDING: "대기",
	ACTIVE: "활성",
	CANCELED: "취소",
	COMPLETED: "완료",
	EXPIRED: "만료",
};

const paymentStatusLabels: Record<string, string> = {
	PENDING: "결제 대기",
	PAID: "결제 완료",
	FAILED: "결제 실패",
	CANCELED: "결제 취소",
	REFUNDED: "환불",
};

const coursePassStatusLabels: Record<string, string> = {
	ACTIVE: "활성",
	SUSPENDED: "정지",
	EXPIRED: "만료",
	CANCELED: "취소",
};

const coursePassKindLabels: Record<string, string> = {
	STANDARD: "수강권",
	MANUAL_GRANT: "수동 발급권",
	MAKEUP: "보강권",
};

/**
 * CourseOffering의 Space 라벨을 계산합니다.
 */
function getSpaceLabel(offering: CourseOfferingDto) {
	return offering.tenant?.space?.ground?.name ?? offering.tenantId;
}

/**
 * CourseOffering의 Timeline 라벨을 계산합니다.
 */
function getTimelineLabel(offering: CourseOfferingDto) {
	if (offering.timeline?.name) return offering.timeline.name;
	if (offering.timelineProvisioningMode === "DEDICATED_ON_ENROLLMENT") {
		return "개인 Timeline";
	}
	return "Timeline 미연결";
}

/**
 * Course DTO를 Course row로 변환합니다.
 */
function toCourse(course: CourseDto): CourseDataCourse {
	return {
		id: course.id,
		name: course.name,
		description: course.description ?? "설명 없음",
		durationLabel: `${course.durationMonths}개월`,
		priceLabel: currencyFormatter.format(course.basePriceAmount),
		activeOfferingCount: course.activeOfferingCount,
		activeEnrollmentCount: course.activeEnrollmentCount,
		statusLabel: courseStatusLabels[course.status] ?? course.status,
		statusTone: getStatusTone(course.status),
	};
}

/**
 * CourseOffering DTO를 Course row로 변환합니다.
 */
function toOffering(offering: CourseOfferingDto): CourseDataOffering {
	return {
		id: offering.id,
		courseName: offering.course?.name ?? offering.courseId,
		name: offering.name,
		spaceLabel: getSpaceLabel(offering),
		periodLabel: getPeriodLabel(offering.startsAt, offering.endsAt),
		timelineName: getTimelineLabel(offering),
		timelineHref: offering.timelineId
			? `/timelines/${offering.timelineId}`
			: "/timelines",
		capacity: offering.capacity,
		enrolledCount: offering.enrolledCount,
		statusLabel: offeringStatusLabels[offering.status] ?? offering.status,
		statusTone: getStatusTone(offering.status),
	};
}

/**
 * Enrollment DTO를 Course row로 변환합니다.
 */
function toEnrollment(enrollment: EnrollmentDto): CourseDataEnrollment {
	return {
		id: enrollment.id,
		studentName:
			enrollment.user?.name ?? enrollment.user?.email ?? enrollment.userId,
		courseName: enrollment.course?.name ?? enrollment.courseId,
		offeringName:
			enrollment.courseOffering?.name ?? enrollment.courseOfferingId,
		paymentLabel:
			paymentStatusLabels[enrollment.paymentStatus] ?? enrollment.paymentStatus,
		validityLabel: getPeriodLabel(enrollment.validFrom, enrollment.validUntil),
		reservationSummary: enrollment.coursePass
			? `${enrollment.coursePass.reservationRemainingCount}회 가능`
			: "수강권 미발급",
		statusLabel: enrollmentStatusLabels[enrollment.status] ?? enrollment.status,
		statusTone: getStatusTone(enrollment.status),
	};
}

/**
 * CoursePass DTO를 Course row로 변환합니다.
 */
function toPass(pass: CoursePassDto): CourseDataPass {
	return {
		id: pass.id,
		holderName: pass.user?.name ?? pass.user?.email ?? pass.userId,
		courseName: pass.course?.name ?? pass.courseId,
		passLabel:
			pass.kind === "STANDARD" && pass.course?.durationMonths
				? `${pass.course.durationMonths}개월 수강권`
				: (coursePassKindLabels[pass.kind] ?? pass.kind),
		issuedAtLabel: getDateLabel(pass.issuedAt),
		expiresAtLabel: getDateLabel(pass.expiresAt),
		remainingReservationLabel: `${pass.reservationRemainingCount}회 가능`,
		statusLabel: coursePassStatusLabels[pass.status] ?? pass.status,
		statusTone: getStatusTone(pass.status),
	};
}

/**
 * Course section summary를 만듭니다.
 */
function toSections({
	courses,
	offerings,
	enrollments,
	passes,
}: {
	courses: CourseDataCourse[];
	offerings: CourseDataOffering[];
	enrollments: CourseDataEnrollment[];
	passes: CourseDataPass[];
}): CourseDataSection[] {
	return [
		{
			id: "courses",
			label: "Course",
			description: "무엇을 배우는지와 기본 수강 상품을 관리합니다.",
			href: "/courses",
			count: courses.length,
			tone: "success",
		},
		{
			id: "course-offerings",
			label: "CourseOffering",
			description: "실제 개설 반, 기수, 모집 정원을 관리합니다.",
			href: "/course-offerings",
			count: offerings.length,
			tone: "primary",
		},
		{
			id: "enrollments",
			label: "Enrollment",
			description: "결제 후 생긴 수강 신청 상태를 관리합니다.",
			href: "/enrollments",
			count: enrollments.length,
			tone: "secondary",
		},
		{
			id: "course-passes",
			label: "CoursePass",
			description: "수강권의 유효기간과 잔여 권리를 관리합니다.",
			href: "/course-passes",
			count: passes.length,
			tone: "warning",
		},
	];
}

/**
 * Course 계열 API 응답을 CourseScreen 입력 계약으로 변환합니다.
 */
export function useCourseData() {
	const coursesQuery = useGetCourses({ take: 50 });
	const offeringsQuery = useGetCourseOfferings({ take: 50 });
	const enrollmentsQuery = useGetEnrollments({ take: 50 });
	const passesQuery = useGetCoursePasses({ take: 50 });

	const courses = (coursesQuery.data?.data ?? []).map(toCourse);
	const offerings = (offeringsQuery.data?.data ?? []).map(toOffering);
	const enrollments = (enrollmentsQuery.data?.data ?? []).map(toEnrollment);
	const passes = (passesQuery.data?.data ?? []).map(toPass);
	const queryState = {
		isLoading:
			coursesQuery.isLoading ||
			offeringsQuery.isLoading ||
			enrollmentsQuery.isLoading ||
			passesQuery.isLoading,
		isFetching:
			coursesQuery.isFetching ||
			offeringsQuery.isFetching ||
			enrollmentsQuery.isFetching ||
			passesQuery.isFetching,
		isError:
			coursesQuery.isError ||
			offeringsQuery.isError ||
			enrollmentsQuery.isError ||
			passesQuery.isError,
	};
	const sections = toSections({
		courses,
		offerings,
		enrollments,
		passes,
	});

	return {
		sections,
		courses,
		offerings,
		enrollments,
		passes,
		queryState,
	};
}
