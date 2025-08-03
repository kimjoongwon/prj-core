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
	CreateTenantDto,
	PageMetaDto,
	QueryTenantDto,
	ResponseEntity,
	TenantDto,
	UpdateTenantDto,
} from "@shared/schema";
import { plainToInstance } from "class-transformer";
import { ApiResponseEntity, Auth } from "../decorator";
import { ContextProvider } from "../provider/context.provider";
import { TenantsService } from "../service/tenants.service";

@ApiTags("TENANTS")
@Controller()
export class TenantsController {
	constructor(private readonly service: TenantsService) {}

	@Get("my")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(TenantDto, HttpStatus.OK, { isArray: true })
	async getMyTenants() {
		const userId = ContextProvider.getAuthUserId();
		const tenants = await this.service.getManyByUserId(userId);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(TenantDto, tenants),
		);
	}

	@Post()
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(TenantDto, HttpStatus.OK)
	async createTenant(@Body() createTenantDto: CreateTenantDto) {
		const tenant = await this.service.create(createTenantDto);

		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(TenantDto, tenant),
		);
	}

	@Get(":tenantId")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(TenantDto, HttpStatus.OK)
	async getTenantById(@Param("tenantId") tenantId: string) {
		const tenant = await this.service.getById(tenantId);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			tenant?.toDto?.() ?? tenant,
		);
	}

	@Patch(":tenantId")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(TenantDto, HttpStatus.OK)
	async updateTenantById(
		@Param("tenantId") tenantId: string,
		@Body() updateTenantDto: UpdateTenantDto,
	) {
		const tenant = await this.service.updateById(tenantId, updateTenantDto);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(TenantDto, tenant),
		);
	}

	@Patch(":tenantId/removedAt")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(TenantDto, HttpStatus.OK)
	async removeTenantById(@Param("tenantId") tenantId: string) {
		const tenant = await this.service.removeById(tenantId);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(TenantDto, tenant),
		);
	}

	@Delete(":tenantId")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(TenantDto, HttpStatus.OK)
	async deleteTenant(@Param("tenantId") tenantId: string) {
		const tenant = await this.service.deleteById(tenantId);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(TenantDto, tenant),
		);
	}

	@Get()
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(TenantDto, HttpStatus.OK, { isArray: true })
	async getTenantsByQuery(@Query() query: QueryTenantDto) {
		const { count, tenants } = await this.service.getManyByQuery(query);
		return new ResponseEntity(
			HttpStatus.OK,
			"success",
			tenants.map((tenant) => tenant?.toDto?.() ?? tenant),
			new PageMetaDto(query.skip, query.take, count),
		);
	}
}
