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
import { Auth, ApiResponseEntity } from '../decorators';
import { GymDto, CreateGymDto, GymQueryDto } from '../dtos';
import { PageMetaDto } from '../dtos/query/page-meta.dto';
import { ResponseEntity } from '../entities/response.entity';
import { GymsService } from '../services/gyms.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('GYMS')
@Controller()
export class GymsController {
  constructor(private readonly service: GymsService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(GymDto, HttpStatus.OK)
  async createGym(@Body() createGymDto: CreateGymDto) {
    const gym = await this.service.create(createGymDto);

    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(GymDto, gym));
  }

  @Get(':gymId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(GymDto, HttpStatus.OK)
  async getGym(@Param('gymId') gymId: string) {
    const gym = await this.service.getById(gymId);
    return new ResponseEntity(HttpStatus.OK, '성공', gym.toDto());
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(GymDto, HttpStatus.OK)
  async removeGyms(@Body() gymIds: string[]) {
    const gyms = await this.service.removeManyByIds(gymIds);
    return new ResponseEntity(HttpStatus.OK, '성공', gyms.count);
  }

  @Patch(':gymId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(GymDto, HttpStatus.OK)
  async removeGym(@Param('gymId') gymId: string) {
    const gym = await this.service.remove(gymId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(GymDto, gym));
  }

  @Delete(':gymId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(GymDto, HttpStatus.OK)
  async deleteGym(@Param('gymId') gymId: string) {
    const gym = await this.service.deleteById(gymId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(GymDto, gym));
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(GymDto, HttpStatus.OK, { isArray: true })
  async getGymsByQuery(@Query() query: GymQueryDto) {
    const { count, gyms } = await this.service.getManyByQuery(query);
    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      gyms.map((gym) => gym.toDto()),
      new PageMetaDto(query.skip, query.take, count),
    );
  }
}
