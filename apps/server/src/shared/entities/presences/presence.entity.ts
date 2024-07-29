import { AbstractEntity } from '../common';
import { $Enums, Presence as PresenceEntity } from '@prisma/client';

export class Presence extends AbstractEntity implements PresenceEntity {
  existence: boolean;
  type: $Enums.PresenceTypes;
  tenantId: string;
  userId: string;
}
