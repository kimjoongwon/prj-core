import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import {
  SessionService,
  CreateSessionDto,
  Auth,
  RoleType,
  ApiResponseEntity,
  SessionDto,
  ResponseEntity,
} from '@shared';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Auth([RoleType.ADMIN])
  @ApiResponseEntity(SessionDto)
  @Post()
  async create(@Body() createSessionDto: CreateSessionDto) {
    const session = await this.sessionService.create(createSessionDto);
    return new ResponseEntity(HttpStatus.CREATED, '생성 완료', session);
  }
}
