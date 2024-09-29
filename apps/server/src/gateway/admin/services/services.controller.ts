import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Logger,
  Post,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  Auth,
  CreateServiceDto,
  ServiceDto,
  ServicesService,
  UpdateServiceDto,
  ApiEndpoints,
  ApiResponseEntity,
  ResponseEntity,
} from '@shared';
import { plainToInstance } from 'class-transformer';

@ApiTags('ADMIN_SERVICES')
@Controller(ApiEndpoints.ADMIN_SERVICES)
export class ServicesController {
  logger = new Logger(ServicesController.name);
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @Auth([])
  @ApiResponseEntity(ServiceDto, HttpStatus.OK, { isArray: true })
  async getAllService() {
    const services = await this.servicesService.getAll();
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      services.map((service) => plainToInstance(ServiceDto, service)),
    );
  }

  @Post()
  @Auth()
  @ApiResponseEntity(ServiceDto, HttpStatus.CREATED)
  createService(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Auth()
  @Get(':serviceId')
  @ApiResponseEntity(ServiceDto, HttpStatus.OK)
  async getService(@Param('serviceId') serviceId: string) {
    const service = await this.servicesService.getUnqiue(serviceId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(ServiceDto, service));
  }

  @Patch(':serviceId')
  @Auth()
  @ApiResponseEntity(ServiceDto, HttpStatus.OK)
  async updateService(
    @Param('serviceId') serviceId: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    const service = await this.servicesService.update(serviceId, updateServiceDto);
    return new ResponseEntity(HttpStatus.OK, '업데이트 성공', plainToInstance(ServiceDto, service));
  }

  @Patch(':serviceId/removedAt')
  @Auth()
  @ApiResponseEntity(ServiceDto, HttpStatus.OK)
  async removeService(@Param('serviceId') serviceId: string) {
    const service = await this.servicesService.remove(serviceId);
    return new ResponseEntity(HttpStatus.OK, '업데이트 성공', plainToInstance(ServiceDto, service));
  }

  @Patch(':serviceIds/removedAt')
  @Auth()
  @ApiResponseEntity(ServiceDto, HttpStatus.OK)
  async removeServices(@Param('serviceIds') serviceIds: string[]) {
    const serviceBatched = await this.servicesService.removeMany(serviceIds);
    return new ResponseEntity(HttpStatus.OK, '업데이트 성공', serviceBatched.count);
  }

  @Delete(':serviceId')
  @Auth()
  @ApiResponseEntity(ServiceDto, HttpStatus.OK)
  async deleteService(@Param('serviceId') serviceId: string) {
    const service = await this.servicesService.delete(serviceId);
    return new ResponseEntity(HttpStatus.OK, '삭제 성공', plainToInstance(ServiceDto, service));
  }
}
