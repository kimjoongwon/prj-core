"use client";

import { CourseScreen } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useCourseData } from "@cocrepo/hook";

export default observer(function EnrollmentsPageRoute() {
	const router = useRouter();
	const courseData = useCourseData();
	const onClickSectionTab = (href: string) => {
		router.push(href as Route);
	};
	const onClickTimelineButton = (href: string) => {
		router.push(href as Route);
	};

	return (
		<>
			<CourseScreen
				activeSectionId="enrollments"
				sections={courseData.sections}
				queryState={courseData.queryState}
				courses={courseData.courses}
				offerings={courseData.offerings}
				enrollments={courseData.enrollments}
				passes={courseData.passes}
				onClickSection={onClickSectionTab}
				onClickTimeline={onClickTimelineButton}
			/>
		</>
	);
});
