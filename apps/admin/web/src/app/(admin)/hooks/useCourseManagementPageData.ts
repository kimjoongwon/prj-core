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
import type {
	CourseManagementCourse,
	CourseManagementEnrollment,
	CourseManagementOffering,
	CourseManagementPass,
	CourseManagementSection,
} from "@cocrepo/ui";

const currencyFormatter = new Intl.NumberFormat("ko-KR", {
	style: "currency",
	currency: "KRW",
	maximumFractionDigits: 0,
});

const getDateLabel = (value?: string | null) => {
	if (!value) return "미정";

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "미정";

	const year = date.getFullYear();
	const month = `${date.getMonth() + 1}`.padStart(2, "0");
	const day = `${date.getDate()}`.padStart(2, "0");

	return `${year}.${month}.${day}`;
};

const getPeriodLabel = (startsAt?: string | null, endsAt?: string | null) =>
	`${getDateLabel(startsAt)} - ${getDateLabel(endsAt)}`;

const getStatusTone = (
	status?: string,
): CourseManagementCourse["statusTone"] => {
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
};

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

const getSpaceLabel = (offering: CourseOfferingDto) =>
	offering.space?.ground?.name ?? offering.spaceId;

const getTimelineLabel = (offering: CourseOfferingDto) => {
	if (offering.timeline?.name) return offering.timeline.name;
	if (offering.timelineProvisioningMode === "DEDICATED_ON_ENROLLMENT") {
		return "개인 Timeline";
	}
	return "Timeline 미연결";
};

const toCourse = (course: CourseDto): CourseManagementCourse => ({
	id: course.id,
	name: course.name,
	description: course.description ?? "설명 없음",
	durationLabel: `${course.durationMonths}개월`,
	priceLabel: currencyFormatter.format(course.basePriceAmount),
	activeOfferingCount: course.activeOfferingCount,
	activeEnrollmentCount: course.activeEnrollmentCount,
	statusLabel: courseStatusLabels[course.status] ?? course.status,
	statusTone: getStatusTone(course.status),
});

const toOffering = (offering: CourseOfferingDto): CourseManagementOffering => ({
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
});

const toEnrollment = (
	enrollment: EnrollmentDto,
): CourseManagementEnrollment => ({
	id: enrollment.id,
	studentName:
		enrollment.user?.name ?? enrollment.user?.email ?? enrollment.userId,
	courseName: enrollment.course?.name ?? enrollment.courseId,
	offeringName: enrollment.courseOffering?.name ?? enrollment.courseOfferingId,
	paymentLabel:
		paymentStatusLabels[enrollment.paymentStatus] ?? enrollment.paymentStatus,
	validityLabel: getPeriodLabel(enrollment.validFrom, enrollment.validUntil),
	reservationSummary: enrollment.coursePass
		? `${enrollment.coursePass.reservationRemainingCount}회 가능`
		: "수강권 미발급",
	statusLabel: enrollmentStatusLabels[enrollment.status] ?? enrollment.status,
	statusTone: getStatusTone(enrollment.status),
});

const toPass = (pass: CoursePassDto): CourseManagementPass => ({
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
});

const toSections = ({
	courses,
	offerings,
	enrollments,
	passes,
}: {
	courses: CourseManagementCourse[];
	offerings: CourseManagementOffering[];
	enrollments: CourseManagementEnrollment[];
	passes: CourseManagementPass[];
}): CourseManagementSection[] => [
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

export const useCourseManagementPageData = () => {
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
};
