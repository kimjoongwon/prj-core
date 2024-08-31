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
import { Auth, ApiResponseEntity } from 'src/shared/decorators';
import { ApiEndpoints } from 'src/shared/types';
import { ResponseEntity } from '../common/response.entity';
import { plainToInstance } from 'class-transformer';
import { PageMetaDto } from '../common';
import { TenancyDto } from '../tenancy';
import {
  SessionService,
  CreateSessionDto,
  SessionDto,
  UpdateSessionDto,
  SessionQueryDto,
} from '../session';

@ApiTags('ADMIN_SESSIONS')
@Controller(ApiEndpoints.ADMIN_SESSIONS)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TenancyDto, HttpStatus.OK)
  async createSession(@Body() createSessionDto: CreateSessionDto) {
    const session = await this.sessionService.create(createSessionDto);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(SessionDto, session));
  }

  @Get(':sessionId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SessionDto, HttpStatus.OK)
  async getSession(@Param('sessionId') sessionId: string) {
    const session = await this.sessionService.getUnique(sessionId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(SessionDto, session));
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SessionDto, HttpStatus.OK)
  async removeSessions(@Body() sessionIds: string[]) {
    const sessions = await this.sessionService.removeMany(sessionIds);
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
    const session = await this.sessionService.update({
      id: sessionId,
      ...updateSessionDto,
    });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(SessionDto, session));
  }

  @Patch(':sessionId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SessionDto, HttpStatus.OK)
  async removeSession(@Param('sessionId') sessionId: string) {
    const session = await this.sessionService.remove(sessionId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(SessionDto, session));
  }

  @Delete(':sessionId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SessionDto, HttpStatus.OK)
  async deleteSession(@Param('sessionId') sessionId: string) {
    const session = await this.sessionService.delete(sessionId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(SessionDto, session));
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SessionDto, HttpStatus.OK, { isArray: true })
  async getSessionsByQuery(@Query() pageQueryDto: SessionQueryDto) {
    const { count, sessions } = await this.sessionService.getManyByQuery(pageQueryDto);

    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      sessions.map((session) => plainToInstance(SessionDto, session)),
      plainToInstance(PageMetaDto, {
        pageQueryDto,
        itemCount: count,
      }),
    );
  }
}
