import { Controller, Post, Body, HttpStatus, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiResponseEntity,
  CreatePresenceDto,
  PresenceDto,
  PresencesService,
  ResponseEntity,
} from '@shared';

@ApiTags('presences')
@Controller()
export class PresencesController {
  constructor(private readonly presencesService: PresencesService) {}

  @Post()
  @ApiResponseEntity(PresenceDto)
  async upsert(@Body() createPresenceDto: CreatePresenceDto) {
    const presence = await this.presencesService.upsert(createPresenceDto);
    return new ResponseEntity(HttpStatus.CREATED, '생성 및 업데이트 성공', presence);
  }

  @Get()
  @ApiResponseEntity(PresenceDto, { isArray: true })
  async findPresencesByUserId(@Query('userId') userId: string) {
    const presences = await this.presencesService.findManyByUserId(userId);
    return new ResponseEntity(HttpStatus.OK, '조회 성공', presences);
  }
}
