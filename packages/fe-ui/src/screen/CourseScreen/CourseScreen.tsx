"use client";

import { CalendarDays } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
import type {
	CourseConsoleProps,
	CourseRow,
	CourseEnrollmentRow,
	CourseOfferingRow,
	CoursePassRow,
	CourseQueryState,
	CourseSection,
	CourseSectionId,
} from "../../feature/course";
import { CourseConsole } from "../../feature/course";
import { VStack } from "../../rhythm";
import { SectionSurface } from "../../surface";
import { PageTitleBar } from "../../widget";

export type CourseScreenProps = CourseConsoleProps;

export const CourseScreen = observer(
	({ onClickTimeline, ...consoleProps }: CourseScreenProps) => {
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
				<SectionSurface>
					<CourseConsole
						{...consoleProps}
						onClickTimeline={onClickTimeline}
					/>
				</SectionSurface>
			</VStack>
		);
	},
);

CourseScreen.displayName = "CourseScreen";

export type {
	CourseRow,
	CourseEnrollmentRow,
	CourseOfferingRow,
	CoursePassRow,
	CourseQueryState,
	CourseSection,
	CourseSectionId,
};
