"use client";

import { useCourseData } from "@cocrepo/hook";
import { CourseScreen, type CourseSectionId } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

interface CoursesPageRouteClientProps {
	activeSectionId: CourseSectionId;
}

export const CoursesPageRouteClient = observer(
	({ activeSectionId }: CoursesPageRouteClientProps) => {
		const router = useRouter();
		const courseData = useCourseData();
		const onClickSectionTab = (href: string) => {
			router.push(href as Route);
		};
		const onClickTimelineButton = (href: string) => {
			router.push(href as Route);
		};

		return (
			<CourseScreen
				activeSectionId={activeSectionId}
				sections={courseData.sections}
				queryState={courseData.queryState}
				courses={courseData.courses}
				offerings={courseData.offerings}
				enrollments={courseData.enrollments}
				passes={courseData.passes}
				onClickSection={onClickSectionTab}
				onClickTimeline={onClickTimelineButton}
			/>
		);
	},
);
CoursesPageRouteClient.displayName = "CoursesPageRouteClient";
