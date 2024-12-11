import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ADMIN_TEMPLATES')
@Controller()
export class AdminTemplatesController {}
