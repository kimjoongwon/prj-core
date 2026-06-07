"use client";

import { CalendarDays } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
import type {
	CourseManagementConsoleProps,
	CourseManagementCourse,
	CourseManagementEnrollment,
	CourseManagementOffering,
	CourseManagementPass,
	CourseManagementQueryState,
	CourseManagementSection,
	CourseManagementSectionId,
} from "../../feature/course-management";
import { CourseManagementConsole } from "../../feature/course-management";
import { VStack } from "../../rhythm";
import { PageTitleBar } from "../../widget";

export type CourseManagementPageProps = CourseManagementConsoleProps;

export const CourseManagementPage = observer(
	({ onClickTimeline, ...consoleProps }: CourseManagementPageProps) => {
		const onClickTimelineButton = () => {
			onClickTimeline("/timelines");
		};

		return (
			<VStack gap="section" fullWidth>
				<PageTitleBar
					title="수강 관리"
					description="Course, CourseOffering, Enrollment, CoursePass의 책임을 분리해 결제 후 생기는 수강 권리를 운영 일정으로 연결합니다."
					actions={
						<Button
							variant="flat"
							color="primary"
							startContent={<CalendarDays className="size-4" />}
							onPress={onClickTimelineButton}
						>
							타임라인 관리
						</Button>
					}
				/>
				<CourseManagementConsole
					{...consoleProps}
					onClickTimeline={onClickTimeline}
				/>
			</VStack>
		);
	},
);

CourseManagementPage.displayName = "CourseManagementPage";

export type {
	CourseManagementCourse,
	CourseManagementEnrollment,
	CourseManagementOffering,
	CourseManagementPass,
	CourseManagementQueryState,
	CourseManagementSection,
	CourseManagementSectionId,
};
