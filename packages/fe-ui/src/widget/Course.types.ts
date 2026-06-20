import type { ChipProps } from "../data-display/Chip/Chip";

export type CourseSectionId =
	| "courses"
	| "course-offerings"
	| "enrollments"
	| "course-passes";

export interface CourseSection {
	id: CourseSectionId;
	label: string;
	description: string;
	href: string;
	count: number;
	tone: ChipProps["color"];
}

export interface CourseQueryState {
	isLoading: boolean;
	isFetching: boolean;
	isError: boolean;
}

export interface CourseRow {
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

export interface CourseOfferingRow {
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

export interface CourseEnrollmentRow {
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

export interface CoursePassRow {
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

export interface CourseMetric {
	label: string;
	value: string;
	icon: "course" | "offering" | "enrollment" | "pass";
}
