import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateGymDto } from '../create';

export class UpdateGymDto extends PartialType(OmitType(CreateGymDto, ['space'])) {}
