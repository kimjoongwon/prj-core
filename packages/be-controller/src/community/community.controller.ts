import {
	CreateCommunityPostCommand,
	GetCommunityPostsQuery,
} from "@cocrepo/command";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
} from "@cocrepo/decorator";
import {
	CommunityPostDto,
	CreateCommunityPostPayloadDto,
	QueryCommunityPostsDto,
} from "@cocrepo/dto";
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Query,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("COMMUNITY")
@Controller()
export class CommunityController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	@Get("posts")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "getCommunityPosts",
		summary: "커뮤니티 게시글 목록 조회",
		description: "현재 Space 기준 커뮤니티 게시글 목록을 조회합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 403, 500)
	@ApiResponseEntity(CommunityPostDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("커뮤니티 게시글 목록 조회 성공")
	getCommunityPosts(@Query() query: QueryCommunityPostsDto) {
		return this.queryBus.execute(new GetCommunityPostsQuery(query));
	}

	@Post("posts")
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		operationId: "createCommunityPost",
		summary: "커뮤니티 게시글 작성",
		description: "현재 Space에 커뮤니티 게시글을 작성합니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreateCommunityPostPayloadDto,
		description: "작성할 커뮤니티 게시글",
	})
	@ApiErrors(400, 401, 403, 500)
	@ApiResponseEntity(CommunityPostDto, HttpStatus.CREATED)
	@ResponseMessage("커뮤니티 게시글 작성 성공")
	createCommunityPost(@Body() dto: CreateCommunityPostPayloadDto) {
		return this.commandBus.execute(new CreateCommunityPostCommand(dto));
	}
}
