import { AbstractEntity } from '../common';
import { $Enums, Template as TemplateEntity } from '@prisma/client';
export class Template extends AbstractEntity implements TemplateEntity {
  name: $Enums.TemplateNames;
  htmlContent: string;
}
