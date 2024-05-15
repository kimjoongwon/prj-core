import { PartialType } from '@nestjs/swagger';
import { CreateAuthzDto } from './create-authz.dto';

export class UpdateAuthzDto extends PartialType(CreateAuthzDto) {}
