import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Patch,
  Delete,
  Get,
  HttpCode,
  Param,
  Query,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Auth, ApiResponseEntity } from '../decorator';
import { TenantDto, CreateTenantDto, UpdateTenantDto, QueryTenantDto } from '../dto';
import { PageMetaDto } from '../dto/query/page-meta.dto';
import { ResponseEntity } from '../entity/response.entity';
import { ApiTags } from '@nestjs/swagger';
import { TenantsService } from '../service/tenants.service';
import { ContextProvider } from '../provider/context.provider';

@ApiTags('TENANTS')
@Controller()
export class TenantsController {
  constructor(private readonly service: TenantsService) {}

  @Get('my')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TenantDto, HttpStatus.OK, { isArray: true })
  async getMyTenants() {
    const userId = ContextProvider.getAuthUserId();
    const tenants = await this.service.getManyByUserId(userId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(TenantDto, tenants));
  }

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TenantDto, HttpStatus.OK)
  async createTenant(@Body() createTenantDto: CreateTenantDto) {
    const tenant = await this.service.create(createTenantDto);

    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(TenantDto, tenant));
  }

  @Get(':tenantId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TenantDto, HttpStatus.OK)
  async getTenantById(@Param('tenantId') tenantId: string) {
    const tenant = await this.service.getById(tenantId);
    return new ResponseEntity(HttpStatus.OK, '성공', tenant.toDto());
  }

  @Patch(':tenantId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TenantDto, HttpStatus.OK)
  async updateTenantById(
    @Param('tenantId') tenantId: string,
    @Body() updateTenantDto: UpdateTenantDto,
  ) {
    const tenant = await this.service.updateById(tenantId, updateTenantDto);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(TenantDto, tenant));
  }

  @Patch(':tenantId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TenantDto, HttpStatus.OK)
  async removeTenantById(@Param('tenantId') tenantId: string) {
    const tenant = await this.service.removeById(tenantId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(TenantDto, tenant));
  }

  @Delete(':tenantId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TenantDto, HttpStatus.OK)
  async deleteTenant(@Param('tenantId') tenantId: string) {
    const tenant = await this.service.deleteById(tenantId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(TenantDto, tenant));
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TenantDto, HttpStatus.OK, { isArray: true })
  async getTenantsByQuery(@Query() query: QueryTenantDto) {
    const { count, tenants } = await this.service.getManyByQuery(query);
    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      tenants.map((tenant) => tenant.toDto()),
      new PageMetaDto(query.skip, query.take, count),
    );
  }
}
