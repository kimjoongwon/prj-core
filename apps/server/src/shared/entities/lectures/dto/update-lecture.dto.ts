import { PartialType } from '@nestjs/swagger';
import { CreateLectureDto } from './create-lecture-item.dto';
import { StringField } from '../../../decorators/field.decorators';

export class UpdateLectureDto extends PartialType(CreateLectureDto) {
  @StringField()
  id: string;
}
