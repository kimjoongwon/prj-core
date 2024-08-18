import { Controller, Get, Body, Patch, Param, Logger, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Auth,
  Public,
  CreateServiceDto,
  ServiceEntity,
  ServiceService,
  UpdateServiceDto,
  ApiEndpoints,
} from '@shared';

@ApiTags('ADMIN_SERVICES')
@Controller(ApiEndpoints.ADMIN_SERVICES)
export class ServicesController {
  logger = new Logger(ServicesController.name);
  constructor(private readonly servicesService: ServiceService) {}

  @Get()
  @Public()
  @ApiResponse({ type: ServiceEntity, isArray: true })
  getAllService() {
    return this.servicesService.findAllService();
  }

  @Auth()
  @ApiResponse({ type: ServiceEntity })
  @Post()
  createService(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Public()
  @Get(':serviceId')
  @ApiParam({ name: 'serviceId', type: 'string' })
  @ApiOkResponse({ type: ServiceEntity })
  getServiceById(@Param('serviceId') serviceId: string) {
    return this.servicesService.getServiceById(serviceId);
  }

  @Public()
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ type: UpdateServiceDto })
  @ApiOkResponse({ type: ServiceEntity })
  @Patch(':id')
  updateService(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }
}
