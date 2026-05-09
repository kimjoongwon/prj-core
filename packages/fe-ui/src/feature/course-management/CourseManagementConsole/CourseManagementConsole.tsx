"use client";

import { VStack } from "@cocrepo/ui";
import { Divider } from "@cocrepo/ui/heroui";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import type {
	CourseManagementCourse,
	CourseManagementEnrollment,
	CourseManagementMetric,
	CourseManagementOffering,
	CourseManagementPass,
	CourseManagementQueryState,
	CourseManagementSection,
	CourseManagementSectionId,
} from "../../../widget/course-management";
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
} from "../../../widget/course-management";

export interface CourseManagementConsoleProps {
	activeSectionId: CourseManagementSectionId;
	sections: CourseManagementSection[];
	queryState: CourseManagementQueryState;
	courses: CourseManagementCourse[];
	offerings: CourseManagementOffering[];
	enrollments: CourseManagementEnrollment[];
	passes: CourseManagementPass[];
	onClickSection: (href: string) => void;
	onClickTimeline: (href: string) => void;
}

const getCourseMetrics = ({
	courses,
	offerings,
	enrollments,
	passes,
}: Pick<
	CourseManagementConsoleProps,
	"courses" | "offerings" | "enrollments" | "passes"
>): CourseManagementMetric[] => {
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
	CourseManagementConsoleProps,
	"activeSectionId" | "courses" | "offerings" | "enrollments" | "passes"
>) => {
	if (activeSectionId === "courses") return courses.length;
	if (activeSectionId === "course-offerings") return offerings.length;
	if (activeSectionId === "enrollments") return enrollments.length;
	return passes.length;
};

const getActiveSectionLabel = (
	activeSectionId: CourseManagementSectionId,
	sections: CourseManagementSection[],
) => {
	return (
		sections.find((section) => section.id === activeSectionId)?.label ??
		activeSectionId
	);
};

const getBlockingStateStatus = (
	queryState: CourseManagementQueryState,
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
	CourseManagementConsoleProps,
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

export const CourseManagementConsole = observer(
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
	}: CourseManagementConsoleProps) => {
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
			<VStack gap="section" fullWidth>
				<CourseFlowRail />
				<CourseMetricGrid metrics={metrics} />
				<CourseSectionTabs
					activeSectionId={activeSectionId}
					sections={sections}
					onClickSection={onClickSection}
				/>
				<Divider className="bg-divider/60" />
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
			</VStack>
		);
	},
);

CourseManagementConsole.displayName = "CourseManagementConsole";

export type {
	CourseManagementCourse,
	CourseManagementEnrollment,
	CourseManagementOffering,
	CourseManagementPass,
	CourseManagementQueryState,
	CourseManagementSection,
	CourseManagementSectionId,
};
