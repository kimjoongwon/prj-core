import type { ChipProps } from "@cocrepo/ui/heroui";

export type CourseManagementSectionId =
	| "courses"
	| "course-offerings"
	| "enrollments"
	| "course-passes";

export interface CourseManagementSection {
	id: CourseManagementSectionId;
	label: string;
	description: string;
	href: string;
	count: number;
	tone: ChipProps["color"];
}

export interface CourseManagementQueryState {
	isLoading: boolean;
	isFetching: boolean;
	isError: boolean;
}

export interface CourseManagementCourse {
	id: string;
	name: string;
	description: string;
	durationLabel: string;
	priceLabel: string;
	activeOfferingCount: number;
	activeEnrollmentCount: number;
	statusLabel: string;
	statusTone: ChipProps["color"];
}

export interface CourseManagementOffering {
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
	statusTone: ChipProps["color"];
}

export interface CourseManagementEnrollment {
	id: string;
	studentName: string;
	courseName: string;
	offeringName: string;
	paymentLabel: string;
	validityLabel: string;
	reservationSummary: string;
	statusLabel: string;
	statusTone: ChipProps["color"];
}

export interface CourseManagementPass {
	id: string;
	holderName: string;
	courseName: string;
	passLabel: string;
	issuedAtLabel: string;
	expiresAtLabel: string;
	remainingReservationLabel: string;
	statusLabel: string;
	statusTone: ChipProps["color"];
}

export interface CourseManagementMetric {
	label: string;
	value: string;
	icon: "course" | "offering" | "enrollment" | "pass";
}
