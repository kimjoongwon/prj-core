import { PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { StringField } from '../../../decorators/field.decorators';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @StringField()
  id: string;
}
