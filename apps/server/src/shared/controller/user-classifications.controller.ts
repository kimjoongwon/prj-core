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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiResponseEntity,
  Auth,
  CreateUserClassificationDto,
  ResponseEntity,
  UpdateUserClassificationDto,
  UserClassificationDto,
  QueryUserClassificationDto,
  UserClassificationsService,
} from '@shared';
import { plainToInstance } from 'class-transformer';

@ApiTags('USER-CLASSIFICATIONS')
@Controller()
export class UserClassificationsController {
  constructor(private readonly service: UserClassificationsService) {}
  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(UserClassificationDto, HttpStatus.OK)
  async createUserClassification(@Body() createUserClassificationDto: CreateUserClassificationDto) {
    const userClassification = await this.service.create(createUserClassificationDto);

    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(UserClassificationDto, userClassification),
    );
  }

  @Get(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(UserClassificationDto, HttpStatus.OK)
  async getUserClassification(@Param('id') id: string) {
    const userClassification = await this.service.getById(id);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(UserClassificationDto, userClassification),
    );
  }

  @Patch(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(UserClassificationDto, HttpStatus.OK)
  async updateUserClassification(
    @Param('id') id: string,
    @Body() updateUserClassificationDto: UpdateUserClassificationDto,
  ) {
    const userClassification = await this.service.updateById(id, updateUserClassificationDto);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(UserClassificationDto, userClassification),
    );
  }

  @Patch(':id/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(UserClassificationDto, HttpStatus.OK)
  async removeUserClassification(@Param('id') id: string) {
    const userClassification = await this.service.removeById(id);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(UserClassificationDto, userClassification),
    );
  }

  @Delete(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(UserClassificationDto, HttpStatus.OK)
  async deleteUserClassification(@Param('userClassificationId') userClassificationId: string) {
    const userClassification = await this.service.deleteById(userClassificationId);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(UserClassificationDto, userClassification),
    );
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(UserClassificationDto, HttpStatus.OK, { isArray: true })
  async getUserClassificationsByQuery(@Query() query: QueryUserClassificationDto) {
    const { items, count } = await this.service.getManyByQuery(query);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(UserClassificationDto, items),
      query.toPageMetaDto(count),
    );
  }
}
