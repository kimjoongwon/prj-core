import { $Enums } from '@prisma/client';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { SystemEmail } from '../system-email.entity';
import { ClassField, EnumField, UUIDField } from '../../../decorators';
import { EmailDto } from '../../emails';
import { TemplateDto } from '../../templates';

export class SystemEmailDto extends AbstractDto implements SystemEmail {
  @EnumField(() => $Enums.EmailStatus)
  status: $Enums.EmailStatus;

  @UUIDField()
  emailId: string;

  @UUIDField()
  templateId: string;

  @ClassField(() => EmailDto, { swagger: false, nullable: true })
  email?: EmailDto;

  @ClassField(() => TemplateDto, { swagger: false, nullable: true })
  template?: TemplateDto;
}
