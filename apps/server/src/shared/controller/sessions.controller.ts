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
	type CreateSessionDto,
	PageMetaDto,
	type QuerySessionDto,
	ResponseEntity,
	SessionDto,
	type UpdateSessionDto,
} from "@shared/schema";
import { plainToInstance } from "class-transformer";
import { ApiResponseEntity, Auth } from "../decorator";
import { SessionsService } from "../service";

@ApiTags("SESSION")
@Controller()
export class SessionsController {
	constructor(private readonly service: SessionsService) {}

	@Post()
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SessionDto, HttpStatus.OK)
	async createSession(@Body() createSessionDto: CreateSessionDto) {
		const session = await this.service.create(createSessionDto);

		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(SessionDto, session),
		);
	}

	@Get(":sessionId")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SessionDto, HttpStatus.OK)
	async getSession(@Param("sessionId") sessionId: string) {
		const session = await this.service.getById(sessionId);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(SessionDto, session),
		);
	}

	@Patch("removedAt")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SessionDto, HttpStatus.OK)
	async removeSessions(@Body() sessionIds: string[]) {
		// Note: updateMany is discontinued, this endpoint may need to be updated to handle individual calls
		const promises = sessionIds.map(id => this.service.removeById(id));
		const results = await Promise.all(promises);
		const sessions = { count: results.length };
		return new ResponseEntity(HttpStatus.OK, "성공", sessions.count);
	}

	@Patch(":sessionId")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SessionDto, HttpStatus.OK)
	async updateSession(
		@Param("sessionId") sessionId: string,
		@Body() updateSessionDto: UpdateSessionDto,
	) {
		const session = await this.service.updateById(sessionId, updateSessionDto);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(SessionDto, session),
		);
	}

	@Patch(":sessionId/removedAt")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SessionDto, HttpStatus.OK)
	async removeSession(@Param("sessionId") sessionId: string) {
		const session = await this.service.removeById(sessionId);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(SessionDto, session),
		);
	}

	@Delete(":sessionId")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SessionDto, HttpStatus.OK)
	async deleteSession(@Param("sessionId") sessionId: string) {
		const session = await this.service.deleteById(sessionId);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(SessionDto, session),
		);
	}

	@Get()
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SessionDto, HttpStatus.OK, { isArray: true })
	async getSessionsByQuery(@Query() query: QuerySessionDto) {
		const { count, sessions } = await this.service.getManyByQuery(query);
		return new ResponseEntity(
			HttpStatus.OK,
			"success",
			sessions.map((session) => session?.toDto?.() ?? session),
			new PageMetaDto(query.skip, query.take, count),
		);
	}
}
