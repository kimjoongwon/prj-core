import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiEndpoints } from '@shared';

@ApiTags('ADMIN_TEMPLATES')
@Controller(ApiEndpoints.ADMIN_TEMPLATES)
export class TemplatesController {}
