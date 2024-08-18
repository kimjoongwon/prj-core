import { Controller, Post, Body } from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { Auth } from 'src/shared/decorators';
import { RoleType } from 'src/shared/constants';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Auth([RoleType.ADMIN])
  @Post()
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionService.create(createSessionDto);
  }
}
