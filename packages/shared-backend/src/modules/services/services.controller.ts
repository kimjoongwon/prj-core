import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Logger,
  Post,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import {
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth, Public } from '../../decorators';
import { ServiceEntity } from './service.entity';
import { UpdateServiceDto } from './dto/update-service.dto';
import { targetConstructorToSchema } from 'class-validator-jsonschema';
import { ServiceFormDto } from './dto/service-form.dto';
import { CreateServiceDto } from './dto/create-service.dto';

@ApiTags('services')
@Controller()
export class ServicesController {
  logger = new Logger(ServicesController.name);
  constructor(private readonly servicesService: ServicesService) {}

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
  @Get('form')
  @ApiResponse({ type: ServiceFormDto })
  getServiceForm() {
    return this.servicesService.getServiceForm();
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
  updateService(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Public()
  @ApiResponse({ type: typeof targetConstructorToSchema(UpdateServiceDto) })
  @Get('schema')
  getUpdateServiceSchema(): object {
    return targetConstructorToSchema(UpdateServiceDto);
  }
}
