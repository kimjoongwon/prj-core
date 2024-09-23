import { OmitType } from '@nestjs/swagger';
import { PostDto } from './post.dto';
import { COMMON_ENTITY_FIELDS } from '../../../constants/entity-common-fields';

export class CreatePostDto extends OmitType(PostDto, [...COMMON_ENTITY_FIELDS, 'author']) {}
