"use client";

import { CourseManagementPage } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useCourseManagementPageData } from "../hooks/useCourseManagementPageData";

export default observer(function CoursePassesPageRoute() {
	const router = useRouter();
	const courseManagementPageData = useCourseManagementPageData();
	const onClickSectionTab = (href: string) => {
		router.push(href as Route);
	};
	const onClickTimelineButton = (href: string) => {
		router.push(href as Route);
	};

	return (
		<CourseManagementPage
			activeSectionId="course-passes"
			sections={courseManagementPageData.sections}
			queryState={courseManagementPageData.queryState}
			courses={courseManagementPageData.courses}
			offerings={courseManagementPageData.offerings}
			enrollments={courseManagementPageData.enrollments}
			passes={courseManagementPageData.passes}
			onClickSection={onClickSectionTab}
			onClickTimeline={onClickTimelineButton}
		/>
	);
});
