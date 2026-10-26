import { ParseBigIntIdPipe, RolesGuard } from "@cocrepo/be-common";
import { GetAssetContentQuery } from "@cocrepo/command";
import { SYSTEM_ROLES } from "@cocrepo/constant";
import { ApiAuth, ApiErrors, Roles } from "@cocrepo/decorator";
import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Res,
	UseGuards,
} from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiOperation, ApiParam, ApiProduces, ApiTags } from "@nestjs/swagger";
import type { Response } from "express";

@ApiTags("ASSETS")
@Controller()
export class AssetsController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get(":assetId/content")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([
		SYSTEM_ROLES.MEMBER,
		SYSTEM_ROLES.COMPANY_MANAGER,
		SYSTEM_ROLES.PLATFORM_ADMIN,
	])
	@ApiOperation({
		operationId: "getAssetContent",
		summary: "에셋 원본 조회",
		description:
			"현재 선택한 Space에 속한 에셋 원본을 인증된 요청으로 반환합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "assetId",
		description: "에셋 ID (ULID)",
		type: String,
	})
	@ApiProduces("*/*")
	@ApiErrors(400, 401, 403, 404, 500)
	async getAssetContent(
		@Param("assetId", ParseBigIntIdPipe) assetId: bigint,
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
}
