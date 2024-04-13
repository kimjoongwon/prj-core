import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { ServicesService } from './services.service';
import {
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../../decorators';
import { ServiceEntity } from './service.entity';
import { UpdateServiceDto } from './dto/update-service.dto';
import { targetConstructorToSchema } from 'class-validator-jsonschema';
import { ServiceFormDto } from './dto/service-form.dto';

@ApiTags('services')
@Controller()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiResponse({ type: ServiceEntity, isArray: true })
  getAllService() {
    return this.servicesService.findAllService();
  }

  @Public()
  @Get('form')
  @ApiResponse({ type: ServiceFormDto })
  getServiceForm() {
    return this.servicesService.getServiceForm();
  }

  @Public()
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ type: UpdateServiceDto })
  @ApiOkResponse({ type: ServiceEntity })
  @Patch(':id')
  updateService(
    @Param() id: string,
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
