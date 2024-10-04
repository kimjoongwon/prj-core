import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateTemplateDto } from './create-template.dto';
import { UpdatePostDto } from '../../posts';
import { ClassField } from '../../../decorators';

export class UpdateTemplateDto extends PartialType(OmitType(CreateTemplateDto, ['post'])) {
  @ClassField(() => UpdatePostDto, { each: true, nullable: true, required: false })
  post?: UpdatePostDto;
}
