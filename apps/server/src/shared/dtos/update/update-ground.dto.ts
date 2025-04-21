import { PartialType } from '@nestjs/swagger';
import { CreateGroundDto } from '../create';

export class UpdateGroundDto extends PartialType(CreateGroundDto) {}