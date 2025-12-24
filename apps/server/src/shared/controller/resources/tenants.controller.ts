import { CONTEXT_KEYS } from "@cocrepo/constant";
import { ApiResponseEntity } from "@cocrepo/decorator";
import {
	CreateTenantDto,
	PageMetaDto,
	QueryTenantDto,
	TenantDto,
	UpdateTenantDto,
	UserDto,
} from "@cocrepo/dto";
import { TenantsService } from "@cocrepo/service";
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
import { ClsService } from "nestjs-cls";
import { wrapResponse } from "../../util/response.util";

@ApiTags("TENANTS")
@Controller()
export class TenantsController {
	constructor(
		private readonly service: TenantsService,
		private readonly cls: ClsService,
	) {}

	@Get("my")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(TenantDto, HttpStatus.OK, { isArray: true })
	async getMyTenants() {
		const userId = this.cls.get<UserDto>(CONTEXT_KEYS.AUTH_USER)?.id;
		// Note: getManyByUserId was replaced with getManyByQuery, may need adjustment
		const tenants = await this.service.getManyByQuery({ userId } as any);
		return tenants;
	}

	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(TenantDto, HttpStatus.OK)
	async createTenant(@Body() createTenantDto: CreateTenantDto) {
		const tenant = await this.service.create(createTenantDto);

		return tenant;
	}

	@Get(":tenantId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(TenantDto, HttpStatus.OK)
	async getTenantById(@Param("tenantId") tenantId: string) {
		const tenant = await this.service.getById(tenantId);
		return tenant;
	}

	@Patch(":tenantId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(TenantDto, HttpStatus.OK)
	async updateTenantById(
		@Param("tenantId") tenantId: string,
		@Body() updateTenantDto: UpdateTenantDto,
	) {
		const tenant = await this.service.updateById(tenantId, updateTenantDto);
		return tenant;
	}

	@Patch(":tenantId/removedAt")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(TenantDto, HttpStatus.OK)
	async removeTenantById(@Param("tenantId") tenantId: string) {
		const tenant = await this.service.removeById(tenantId);
		return tenant;
	}

	@Delete(":tenantId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(TenantDto, HttpStatus.OK)
	async deleteTenant(@Param("tenantId") tenantId: string) {
		const tenant = await this.service.deleteById(tenantId);
		return tenant;
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(TenantDto, HttpStatus.OK, { isArray: true })
	async getTenantsByQuery(@Query() query: QueryTenantDto) {
		const { count, tenants } = await this.service.getManyByQuery(query);
		return wrapResponse(tenants, {
			message: "success",
			meta: new PageMetaDto(query.skip, query.take, count),
		});
	}
}
