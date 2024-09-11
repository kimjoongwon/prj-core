import { AbstractEntity } from '../common';
import { $Enums, Template as TemplateEntity } from '@prisma/client';
export class Template extends AbstractEntity implements TemplateEntity {
  postId: string;
  serviceId: string;
  keys: string[];
  name: $Enums.TemplateNames;
}
