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
import {
	AssignmentDto,
	CreateAssignmentDto,
	PageMetaDto,
	QueryAssignmentDto,
	ResponseEntity,
} from "@shared/schema";
import { plainToInstance } from "class-transformer";
import { ApiResponseEntity } from "@shared/schema";
import { AssignmentsService } from "../../service/resources/assignments.service";

@ApiTags("ASSIGNMENTS")
@Controller()
export class AssignmentsController {
	constructor(private readonly service: AssignmentsService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(AssignmentDto, HttpStatus.OK)
	async createAssignment(@Body() createAssignmentDto: CreateAssignmentDto) {
		const assignment = await this.service.create(createAssignmentDto);

		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(AssignmentDto, assignment),
		);
	}

	@Get(":assignmentId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(AssignmentDto, HttpStatus.OK)
	async getAssignment(@Param("assignmentId") assignmentId: string) {
		const assignment = await this.service.getById(assignmentId);

		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			assignment?.toDto?.() ?? assignment,
		);
	}

	@Patch("removedAt")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(AssignmentDto, HttpStatus.OK)
	async removeAssignments(@Body() assignmentIds: string[]) {
		const promises = assignmentIds.map((id) => this.service.removeById(id));
		const results = await Promise.all(promises);
		const assignments = { count: results.length };
		return new ResponseEntity(HttpStatus.OK, "성공", assignments.count);
	}

	@Patch(":assignmentId/removedAt")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(AssignmentDto, HttpStatus.OK)
	async removeAssignmentById(@Param("assignmentId") assignmentId: string) {
		const assignment = await this.service.removeById(assignmentId);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(AssignmentDto, assignment),
		);
	}

	@Delete(":assignmentId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(AssignmentDto, HttpStatus.OK)
	async deleteAssignment(@Param("assignmentId") assignmentId: string) {
		const assignment = await this.service.deleteById(assignmentId);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(AssignmentDto, assignment),
		);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(AssignmentDto, HttpStatus.OK, { isArray: true })
	async getAssignmentsByQuery(@Query() query: QueryAssignmentDto) {
		const { count, assignments } = await this.service.getManyByQuery(query);
		return new ResponseEntity(
			HttpStatus.OK,
			"success",
			assignments.map((assignment) => assignment?.toDto?.() ?? assignment),
			new PageMetaDto(query.skip, query.take, count),
		);
	}
}
