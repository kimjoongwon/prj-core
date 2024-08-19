import { Controller, Post, Body, HttpStatus, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  SessionService,
  CreateSessionDto,
  Auth,
  RoleType,
  ApiResponseEntity,
  SessionDto,
  ResponseEntity,
  ApiEndpoints,
  UpdateSessionDto,
} from '@shared';

@ApiTags('ADMIN_SESSIONS')
@Controller(ApiEndpoints.ADMIN_SESSIONS)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Auth([RoleType.ADMIN])
  @ApiResponseEntity(SessionDto)
  @Post()
  async createSession(@Body() createSessionDto: CreateSessionDto) {
    const session = await this.sessionService.create(createSessionDto);
    return new ResponseEntity(HttpStatus.CREATED, '생성 완료', session);
  }

  @Auth([RoleType.ADMIN])
  @ApiResponseEntity(SessionDto)
  @Patch()
  async updateSesson(@Body() updateSessionDto: UpdateSessionDto) {
    const session = await this.sessionService.update(updateSessionDto);
    return new ResponseEntity(HttpStatus.OK, '수정 완료', session);
  }
}
