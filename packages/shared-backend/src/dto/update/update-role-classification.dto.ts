import { PartialType } from '@nestjs/swagger';
import { CreateRoleClassificationDto } from '../create/create-role-classification.dto';

export class UpdateRoleClassificationDto extends PartialType(CreateRoleClassificationDto) {}
