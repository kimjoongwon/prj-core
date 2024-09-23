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
import { ApiTags } from '@nestjs/swagger';
import { ResponseEntity } from '../common/response.entity';
import { plainToInstance } from 'class-transformer';
import { PageMetaDto } from '../common';
import { TenancyDto } from '../tenancies';
import { CreateSessionDto, SessionDto, UpdateSessionDto, SessionQueryDto } from '../sessions/dtos';
import { ApiEndpoints } from '../../types/enums/api-endpoints';
import { Auth } from '../../decorators/auth.decorator';
import { ApiResponseEntity } from '../../decorators/api-response-entity.decorator';
import { SessionsService } from './sessions.service';

@ApiTags('ADMIN_SESSIONS')
@Controller(ApiEndpoints.ADMIN_SESSIONS)
export class SessionsController {
  constructor(private readonly service: SessionsService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TenancyDto, HttpStatus.OK)
  async createSession(@Body() createSessionDto: CreateSessionDto) {
    const session = await this.service.create(createSessionDto);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(SessionDto, session));
  }

  @Get(':sessionId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SessionDto, HttpStatus.OK)
  async getSession(@Param('sessionId') sessionId: string) {
    const session = await this.service.getUnique(sessionId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(SessionDto, session));
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SessionDto, HttpStatus.OK)
  async removeSessions(@Body() sessionIds: string[]) {
    const sessions = await this.service.removeMany(sessionIds);
    return new ResponseEntity(HttpStatus.OK, '성공', sessions.count);
  }

  @Patch(':sessionId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SessionDto, HttpStatus.OK)
  async updateSession(
    @Param('sessionId') sessionId: string,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    const session = await this.service.update(sessionId, updateSessionDto);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(SessionDto, session));
  }

  @Patch(':sessionId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SessionDto, HttpStatus.OK)
  async removeSession(@Param('sessionId') sessionId: string) {
    const session = await this.service.remove(sessionId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(SessionDto, session));
  }

  @Delete(':sessionId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SessionDto, HttpStatus.OK)
  async deleteSession(@Param('sessionId') sessionId: string) {
    const session = await this.service.delete(sessionId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(SessionDto, session));
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SessionDto, HttpStatus.OK, { isArray: true })
  async getSessionsByQuery(@Query() sessionQueryDto: SessionQueryDto) {
    const { count, sessions } = await this.service.getManyByQuery(sessionQueryDto);

    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      sessions.map((session) => plainToInstance(SessionDto, session)),
      new PageMetaDto({
        pageQueryDto: sessionQueryDto,
        itemCount: count,
      }),
    );
  }
}
