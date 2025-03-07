import { PartialType } from '@nestjs/swagger';
import { CreateGymDto } from '../create';

export class UpdateGymDto extends PartialType(CreateGymDto) {}
