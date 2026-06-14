"use client";

import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { Separator } from "@heroui/react";
import type {
	CourseRow,
	CourseEnrollmentRow,
	CourseMetric,
	CourseOfferingRow,
	CoursePassRow,
	CourseQueryState,
	CourseSection,
	CourseSectionId,
} from "../../../widget/course";
import {
	CourseEnrollmentTable,
	CourseFlowRail,
	CourseMetricGrid,
	CourseOfferingTable,
	CoursePassTable,
	CourseSectionTabs,
	CourseTable,
	CourseTableStatePanel,
	type CourseTableStatePanelStatus,
} from "../../../widget/course";

export interface CourseConsoleProps {
	activeSectionId: CourseSectionId;
	sections: CourseSection[];
	queryState: CourseQueryState;
	courses: CourseRow[];
	offerings: CourseOfferingRow[];
	enrollments: CourseEnrollmentRow[];
	passes: CoursePassRow[];
	onClickSection: (href: string) => void;
	onClickTimeline: (href: string) => void;
}

const getCourseMetrics = ({
	courses,
	offerings,
	enrollments,
	passes,
}: Pick<
	CourseConsoleProps,
	"courses" | "offerings" | "enrollments" | "passes"
>): CourseMetric[] => {
	return [
		{
			label: "운영 Course",
			value: `${courses.length}개`,
			icon: "course",
		},
		{
			label: "모집 Offering",
			value: `${offerings.length}개`,
			icon: "offering",
		},
		{
			label: "활성 Enrollment",
			value: `${enrollments.length}건`,
			icon: "enrollment",
		},
		{
			label: "활성 Pass",
			value: `${passes.length}건`,
			icon: "pass",
		},
	];
};

const getActiveItemCount = ({
	activeSectionId,
	courses,
	offerings,
	enrollments,
	passes,
}: Pick<
	CourseConsoleProps,
	"activeSectionId" | "courses" | "offerings" | "enrollments" | "passes"
>) => {
	if (activeSectionId === "courses") return courses.length;
	if (activeSectionId === "course-offerings") return offerings.length;
	if (activeSectionId === "enrollments") return enrollments.length;
	return passes.length;
};

const getActiveSectionLabel = (
	activeSectionId: CourseSectionId,
	sections: CourseSection[],
) => {
	return (
		sections.find((section) => section.id === activeSectionId)?.label ??
		activeSectionId
	);
};

const getBlockingStateStatus = (
	queryState: CourseQueryState,
	activeItemCount: number,
): CourseTableStatePanelStatus | null => {
	if (queryState.isLoading) return "loading";
	if (queryState.isError) return "error";
	if (activeItemCount === 0) return "empty";
	return null;
};

const renderActiveTable = ({
	activeSectionId,
	courses,
	offerings,
	enrollments,
	passes,
	onClickTimeline,
}: Pick<
	CourseConsoleProps,
	| "activeSectionId"
	| "courses"
	| "offerings"
	| "enrollments"
	| "passes"
	| "onClickTimeline"
>): ReactNode => {
	if (activeSectionId === "courses") {
		return <CourseTable courses={courses} />;
	}

	if (activeSectionId === "course-offerings") {
		return (
			<CourseOfferingTable
				offerings={offerings}
				onClickTimeline={onClickTimeline}
			/>
		);
	}

	if (activeSectionId === "enrollments") {
		return <CourseEnrollmentTable enrollments={enrollments} />;
	}

	return <CoursePassTable passes={passes} />;
};

export const CourseConsole = observer(
	({
		activeSectionId,
		sections,
		queryState,
		courses,
		offerings,
		enrollments,
		passes,
		onClickSection,
		onClickTimeline,
	}: CourseConsoleProps) => {
		const metrics = getCourseMetrics({
			courses,
			offerings,
			enrollments,
			passes,
		});
		const activeItemCount = getActiveItemCount({
			activeSectionId,
			courses,
			offerings,
			enrollments,
			passes,
		});
		const activeSectionLabel = getActiveSectionLabel(activeSectionId, sections);
		const blockingStateStatus = getBlockingStateStatus(
			queryState,
			activeItemCount,
		);
		const isRefreshing =
			queryState.isFetching && !queryState.isLoading && !queryState.isError;
		const shouldShowTable = blockingStateStatus === null;

		return (
			<div className="flex w-full flex-col gap-6">
				<CourseFlowRail />
				<CourseMetricGrid metrics={metrics} />
				<CourseSectionTabs
					activeSectionId={activeSectionId}
					sections={sections}
					onClickSection={onClickSection}
				/>
				<Separator className="bg-border/60" />
				{isRefreshing ? (
					<CourseTableStatePanel
						status="refreshing"
						sectionLabel={activeSectionLabel}
					/>
				) : null}
				{blockingStateStatus ? (
					<CourseTableStatePanel
						status={blockingStateStatus}
						sectionLabel={activeSectionLabel}
					/>
				) : null}
				{shouldShowTable
					? renderActiveTable({
							activeSectionId,
							courses,
							offerings,
							enrollments,
							passes,
							onClickTimeline,
						})
					: null}
			</div>
		);
	},
);

CourseConsole.displayName = "CourseConsole";

export type {
	CourseRow,
	CourseEnrollmentRow,
	CourseOfferingRow,
	CoursePassRow,
	CourseQueryState,
	CourseSection,
	CourseSectionId,
};
