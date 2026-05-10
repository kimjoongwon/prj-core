import { COMMON_ERRORS } from "@cocrepo/constant";
import type {
	CreateCourseDto,
	CreateCourseOfferingDto,
	CreateEnrollmentDto,
	UpdateCourseDto,
	UpdateCourseOfferingDto,
	UpdateCoursePassDto,
	UpdateEnrollmentDto,
} from "@cocrepo/dto";
import { AuthContext, CourseService, SpaceContext } from "@cocrepo/service";
import { Injectable, UnauthorizedException } from "@nestjs/common";

interface CourseCommandContext {
	spaceId: string;
}

@Injectable()
export class CourseApplicationService {
	constructor(
		private readonly courseService: CourseService,
		private readonly authContext: AuthContext,
		private readonly spaceContext: SpaceContext,
	) {}

	createCourse(
		dto: CreateCourseDto,
	): ReturnType<CourseService["createCourse"]> {
		return this.courseService.createCourse({
			...dto,
			...this.requireCommandContext(),
		});
	}

	updateCourse(
		courseId: string,
		dto: UpdateCourseDto,
	): ReturnType<CourseService["updateCourse"]> {
		this.requireCommandContext();
		return this.courseService.updateCourse(courseId, dto);
	}

	deleteCourse(courseId: string): ReturnType<CourseService["deleteCourse"]> {
		this.requireCommandContext();
		return this.courseService.deleteCourse(courseId);
	}

	createCourseOffering(
		dto: CreateCourseOfferingDto,
	): ReturnType<CourseService["createCourseOffering"]> {
		return this.courseService.createCourseOffering({
			...dto,
			...this.requireCommandContext(),
		});
	}

	updateCourseOffering(
		courseOfferingId: string,
		dto: UpdateCourseOfferingDto,
	): ReturnType<CourseService["updateCourseOffering"]> {
		this.requireCommandContext();
		return this.courseService.updateCourseOffering(courseOfferingId, dto);
	}

	deleteCourseOffering(
		courseOfferingId: string,
	): ReturnType<CourseService["deleteCourseOffering"]> {
		this.requireCommandContext();
		return this.courseService.deleteCourseOffering(courseOfferingId);
	}

	createEnrollment(
		dto: CreateEnrollmentDto,
	): ReturnType<CourseService["createEnrollment"]> {
		this.requireCommandContext();
		return this.courseService.createEnrollment(dto);
	}

	updateEnrollment(
		enrollmentId: string,
		dto: UpdateEnrollmentDto,
	): ReturnType<CourseService["updateEnrollment"]> {
		this.requireCommandContext();
		return this.courseService.updateEnrollment(enrollmentId, dto);
	}

	deleteEnrollment(
		enrollmentId: string,
	): ReturnType<CourseService["deleteEnrollment"]> {
		this.requireCommandContext();
		return this.courseService.deleteEnrollment(enrollmentId);
	}

	updateCoursePass(
		coursePassId: string,
		dto: UpdateCoursePassDto,
	): ReturnType<CourseService["updateCoursePass"]> {
		this.requireCommandContext();
		return this.courseService.updateCoursePass(coursePassId, dto);
	}

	private requireCommandContext(): CourseCommandContext {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(COMMON_ERRORS.SPACE_NOT_SELECTED);
		}

		if (!this.authContext.user?.id) {
			throw new UnauthorizedException(COMMON_ERRORS.USER_NOT_FOUND);
		}

		return {
			spaceId,
		};
	}
}
