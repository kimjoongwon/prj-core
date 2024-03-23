import { createZodDto } from 'nestjs-zod';
import _ from 'lodash';
import { RelatedSpaceModel } from '@coc/database';

export class ProfileDto extends createZodDto(RelatedSpaceModel) {}
