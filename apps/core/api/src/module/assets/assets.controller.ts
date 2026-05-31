import { RolesGuard } from "@cocrepo/be-common";
import {
	DeleteAssetCommand,
	GetAssetByIdQuery,
	GetAssetContentQuery,
	GetAssetsQuery,
	MoveAssetCommand,
	UploadAssetCommand,
} from "@cocrepo/command";
import { SYSTEM_ROLES, USER_ERRORS } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
	Roles,
} from "@cocrepo/decorator";
import {
	AssetDto,
	AssetQueryDto,
	MoveAssetDto,
	UploadAssetDto,
} from "@cocrepo/dto";
import { AuthContext } from "@cocrepo/service";
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
	Res,
	UnauthorizedException,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { FileInterceptor } from "@nestjs/platform-express";
import {
	ApiBody,
	ApiConsumes,
	ApiOperation,
	ApiParam,
	ApiProduces,
	ApiTags,
} from "@nestjs/swagger";
import type { Response } from "express";

@ApiTags("ASSETS")
@Controller()
export class AssetsController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
		private readonly authContext: AuthContext,
	) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.VIEW, SYSTEM_ROLES.MANAGE, SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "getAssets",
		summary: "에셋 목록 조회",
		description:
			"현재 선택한 Space의 에셋 목록을 조회합니다. 검색, 상태, 타입, 폴더 필터와 페이지네이션을 지원합니다.",
	})
	@ApiAuth()
	@ApiErrors(400, 401, 403, 500)
	@ApiResponseEntity(AssetDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("에셋 목록 조회 성공")
	async getAssets(@Query() query: AssetQueryDto) {
		return this.queryBus.execute(new GetAssetsQuery(query));
	}

	@Get(":assetId")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.VIEW, SYSTEM_ROLES.MANAGE, SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "getAssetById",
		summary: "에셋 상세 조회",
		description: "현재 선택한 Space에 속한 에셋 상세 정보를 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "assetId",
		description: "에셋 ID (UUID)",
		type: String,
	})
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(AssetDto, HttpStatus.OK)
	@ResponseMessage("에셋 상세 조회 성공")
	async getAssetById(@Param("assetId", ParseUUIDPipe) assetId: string) {
		return this.queryBus.execute(new GetAssetByIdQuery(assetId));
	}

	@Get(":assetId/content")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.VIEW, SYSTEM_ROLES.MANAGE, SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "getAssetContent",
		summary: "에셋 원본 조회",
		description:
			"현재 선택한 Space에 속한 에셋 원본을 인증된 요청으로 반환합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "assetId",
		description: "에셋 ID (UUID)",
		type: String,
	})
	@ApiProduces("*/*")
	@ApiErrors(400, 401, 403, 404, 500)
	async getAssetContent(
		@Param("assetId", ParseUUIDPipe) assetId: string,
		@Res() res: Response,
	) {
		const content = await this.queryBus.execute(
			new GetAssetContentQuery(assetId),
		);

		res.setHeader("Content-Type", content.contentType);
		res.setHeader(
			"Content-Disposition",
			`inline; filename*=UTF-8''${encodeURIComponent(content.fileName)}`,
		);
		res.setHeader("Cache-Control", "private, max-age=60");

		if (content.contentLength) {
			res.setHeader("Content-Length", String(content.contentLength));
		}

		if (content.etag) {
			res.setHeader("ETag", content.etag);
		}

		if (content.lastModified) {
			res.setHeader("Last-Modified", content.lastModified.toUTCString());
		}

		res.status(HttpStatus.OK).send(content.body);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(RolesGuard)
	@UseInterceptors(FileInterceptor("file"))
	@Roles([SYSTEM_ROLES.MANAGE, SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "uploadAsset",
		summary: "에셋 업로드",
		description:
			"현재 선택한 Space 안의 폴더로 파일을 업로드하고 에셋 메타데이터를 생성합니다.",
	})
	@ApiAuth()
	@ApiConsumes("multipart/form-data")
	@ApiBody({
		schema: {
			type: "object",
			required: ["folderId", "file"],
			properties: {
				folderId: {
					type: "string",
					format: "uuid",
					description: "업로드 대상 폴더 ID",
				},
				file: {
					type: "string",
					format: "binary",
					description: "업로드 파일",
				},
			},
		},
	})
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(AssetDto, HttpStatus.CREATED)
	@ResponseMessage("에셋 업로드 성공")
	async uploadAsset(
		@Body() dto: UploadAssetDto,
		@UploadedFile() file: Express.Multer.File | undefined,
	) {
		const userId = this.authContext.user?.id;
		if (!userId) {
			throw new UnauthorizedException(USER_ERRORS.USER_NOT_FOUND);
		}

		return this.commandBus.execute(new UploadAssetCommand(dto, file, userId));
	}

	@Patch(":assetId/move")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.MANAGE, SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "moveAsset",
		summary: "에셋 폴더 이동",
		description: "현재 선택한 Space 안에서 에셋의 소속 폴더를 변경합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "assetId",
		description: "에셋 ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: MoveAssetDto,
		description: "이동할 대상 폴더 정보",
	})
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(AssetDto, HttpStatus.OK)
	@ResponseMessage("에셋 이동 성공")
	async moveAsset(
		@Param("assetId", ParseUUIDPipe) assetId: string,
		@Body() dto: MoveAssetDto,
	) {
		return this.commandBus.execute(new MoveAssetCommand(assetId, dto));
	}

	@Delete(":assetId")
	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.MANAGE, SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "removeAsset",
		summary: "에셋 삭제",
		description: "현재 선택한 Space에 속한 에셋을 삭제합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "assetId",
		description: "에셋 ID (UUID)",
		type: String,
	})
	@ApiErrors(400, 401, 403, 404, 500)
	@ResponseMessage("에셋 삭제 성공")
	async removeAsset(
		@Param("assetId", ParseUUIDPipe) assetId: string,
	): Promise<void> {
		await this.commandBus.execute(new DeleteAssetCommand(assetId));
	}
}
