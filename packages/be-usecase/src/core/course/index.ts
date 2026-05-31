import { GetCourseOfferingsUseCase } from "./get-course-offerings.usecase";
import { GetCoursePassesUseCase } from "./get-course-passes.usecase";
import { GetCoursesUseCase } from "./get-courses.usecase";
import { GetEnrollmentsUseCase } from "./get-enrollments.usecase";

export const CourseQueryHandlers = [
	GetCoursesUseCase,
	GetCourseOfferingsUseCase,
	GetEnrollmentsUseCase,
	GetCoursePassesUseCase,
];

export const CourseCommandHandlers = [];

export * from "./get-course-offerings.usecase";
export * from "./get-course-passes.usecase";
export * from "./get-courses.usecase";
export * from "./get-enrollments.usecase";
