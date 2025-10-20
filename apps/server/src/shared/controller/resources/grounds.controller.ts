import {
	ApiResponseEntity,
	CreateGroundDto,
	GroundDto,
	QueryGroundDto,
	UpdateGroundDto,
} from "@cocrepo/schema";
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
import {
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";
import { GroundsService } from "../../service/resources/grounds.service";
import { wrapResponse } from "../../util/response.util";

@ApiTags("GROUNDS")
@Controller()
export class GroundsController {
	constructor(private readonly groundsService: GroundsService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: "새로운 Ground 생성" })
	@ApiResponse({ status: 200, description: "성공" })
	@ApiBody({ type: CreateGroundDto, description: "생성할 Ground 데이터" })
	async createGround(@Body() createGroundDto: CreateGroundDto) {
		const ground = await this.groundsService.create(createGroundDto);
		return plainToInstance(GroundDto, ground);
	}

	@Get(":groundId")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: "ID로 Ground 조회" })
	@ApiResponse({ status: 200, description: "성공" })
	@ApiParam({ name: "groundId", description: "Ground ID", type: "string" })
	async getGroundById(@Param("groundId") id: string) {
		const ground = await this.groundsService.getById(id);
		if (!ground) {
			return wrapResponse(null, {
				status: HttpStatus.NOT_FOUND,
				message: "Ground를 찾을 수 없습니다.",
			});
		}
		return plainToInstance(GroundDto, ground);
	}

	@Patch(":groundId")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: "ID로 Ground 수정" })
	@ApiResponse({ status: 200, description: "성공" })
	@ApiParam({ name: "groundId", description: "Ground ID", type: "string" })
	@ApiBody({ type: UpdateGroundDto, description: "수정할 Ground 데이터" })
	async updateGroundById(
		@Param("groundId") id: string,
		@Body() updateGroundDto: UpdateGroundDto,
	) {
		const ground = await this.groundsService.updateById(id, updateGroundDto);
		return plainToInstance(GroundDto, ground);
	}

	@Patch(":groundId/removedAt")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: "ID로 Ground 삭제 (soft delete)" })
	@ApiResponse({ status: 200, description: "성공" })
	@ApiParam({ name: "groundId", description: "Ground ID", type: "string" })
	async removeGroundById(@Param("groundId") id: string) {
		const ground = await this.groundsService.removeById(id);
		return plainToInstance(GroundDto, ground);
	}

	@Delete(":groundId")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: "ID로 Ground 완전 삭제 (hard delete)" })
	@ApiResponse({ status: 200, description: "성공" })
	@ApiParam({ name: "groundId", description: "Ground ID", type: "string" })
	async deleteGroundById(@Param("groundId") id: string) {
		const ground = await this.groundsService.deleteById(id);
		return plainToInstance(GroundDto, ground);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: "Ground 목록 조회" })
	@ApiResponseEntity(GroundDto, HttpStatus.OK)
	async getGroundsByQuery(@Query() query: QueryGroundDto) {
		const { grounds, count } = await this.groundsService.getManyByQuery(query);
		return wrapResponse(plainToInstance(GroundDto, grounds), {
			meta: query.toPageMetaDto(count),
		});
	}
}
