import { OmitType } from '@nestjs/swagger';
import { PresenceDto } from './presence.dto';

export class CreatePresenceDto extends OmitType(PresenceDto, [
  'createdAt',
  'deletedAt',
  'updatedAt',
]) {}
