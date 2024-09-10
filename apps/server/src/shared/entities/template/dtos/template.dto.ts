import { $Enums } from '@prisma/client';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Template } from '../template.entity';
import { EnumField, StringField } from '../../../decorators/field.decorators';

export class TemplateDto extends AbstractDto implements Template {
  @EnumField(() => $Enums.TemplateNames)
  name: $Enums.TemplateNames;

  @StringField()
  htmlContent: string;
}
