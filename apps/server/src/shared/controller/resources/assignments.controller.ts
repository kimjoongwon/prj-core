import { ApiResponseEntity } from "@cocrepo/decorator";
import {
	AssignmentDto,
	CreateAssignmentDto,
	PageMetaDto,
	QueryAssignmentDto,
} from "@cocrepo/dto";
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AssignmentsService } from "../../service/resources/assignments.service";
import { wrapResponse } from "../../util/response.util";

@ApiTags("ASSIGNMENTS")
@Controller()
export class AssignmentsController {
	constructor(private readonly service: AssignmentsService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(AssignmentDto, HttpStatus.OK)
	async createAssignment(@Body() createAssignmentDto: CreateAssignmentDto) {
		const assignment = await this.service.create(createAssignmentDto);

		return assignment;
	}

	@Get(":assignmentId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(AssignmentDto, HttpStatus.OK)
	async getAssignment(@Param("assignmentId") assignmentId: string) {
		const assignment = await this.service.getById(assignmentId);

		return assignment;
	}

	@Patch("removedAt")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(AssignmentDto, HttpStatus.OK)
	async removeAssignments(@Body() assignmentIds: string[]) {
		const promises = assignmentIds.map((id) => this.service.removeById(id));
		const results = await Promise.all(promises);
		const assignments = { count: results.length };
		return assignments.count;
	}

	@Patch(":assignmentId/removedAt")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(AssignmentDto, HttpStatus.OK)
	async removeAssignmentById(@Param("assignmentId") assignmentId: string) {
		const assignment = await this.service.removeById(assignmentId);
		return assignment;
	}

	@Delete(":assignmentId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(AssignmentDto, HttpStatus.OK)
	async deleteAssignment(@Param("assignmentId") assignmentId: string) {
		const assignment = await this.service.deleteById(assignmentId);
		return assignment;
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(AssignmentDto, HttpStatus.OK, { isArray: true })
	async getAssignmentsByQuery(@Query() query: QueryAssignmentDto) {
		const { count, assignments } = await this.service.getManyByQuery(query);
		return wrapResponse(assignments, {
			message: "success",
			meta: new PageMetaDto(query.skip, query.take, count),
		});
	}
}
