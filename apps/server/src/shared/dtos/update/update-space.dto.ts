import { OmitType, PartialType } from '@nestjs/swagger';
import { SpaceDto } from '../space.dto';

export class UpdateSpaceDto extends PartialType(OmitType(SpaceDto, ['groups'])) {}
