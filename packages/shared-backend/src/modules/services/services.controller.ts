import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import {
  CreateServiceDto,
  ServiceFormDto,
  serviceFormDto,
  createServiceDtoJsonSchema,
} from './dto/create-service.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ServiceDto } from '../../../prisma/src/zod';
import { Public } from '../../decorators';

@ApiTags('api/admin/services')
@Controller('admin/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Public()
  @Post()
  @ApiResponse({
    type: ServiceDto,
    status: 201,
    description: 'The record has been successfully created.',
  })
  createService(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Public()
  @Get('form')
  @ApiResponse({
    type: ServiceFormDto,
    status: 200,
  })
  getServiceForm() {
    return serviceFormDto;
  }

  @Public()
  @Get('schema')
  @ApiResponse({
    type: Object,
    status: 200,
  })
  getCreateServiceDtoSchema() {
    return createServiceDtoJsonSchema;
  }

  @Public()
  @Patch(':id')
  deleteService(@Param('id') id: string) {
    return this.servicesService.delete(id);
  }
}
