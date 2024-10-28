import { AbstractEntity } from '../common';
import { $Enums, SystemEmail as SystemEmailEntity } from '@prisma/client';
export class SystemEmail extends AbstractEntity implements SystemEmailEntity {
  tenantId: string;
  status: $Enums.EmailStatus;
  emailId: string;
  templateId: string;
}
