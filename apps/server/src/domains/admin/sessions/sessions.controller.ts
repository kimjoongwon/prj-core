import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiEndpoints } from '@shared';

@ApiTags('ADMIN_SESSIONS')
@Controller(ApiEndpoints.ADMIN_SESSIONS)
export class SessionsController {}
