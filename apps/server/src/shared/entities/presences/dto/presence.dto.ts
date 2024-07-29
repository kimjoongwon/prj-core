import { BooleanField, EnumField, UUIDField } from 'src/shared/decorators';
import { AbstractDto } from '../../common';
import { Presence } from '../presence.entity';
import { $Enums } from '@prisma/client';

export class PresenceDto extends AbstractDto implements Presence {
  @BooleanField({ default: false, description: '이용자가 존재유무' })
  existence: boolean;

  @EnumField(() => $Enums.PresenceTypes, { description: '출석 유형' })
  type: $Enums.PresenceTypes;

  @UUIDField({ description: '테넌트 ID' })
  tenantId: string;

  @UUIDField({ description: '사용자 ID' })
  userId: string;
}
