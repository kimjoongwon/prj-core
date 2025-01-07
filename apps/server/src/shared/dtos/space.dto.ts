import { Space } from '@prisma/client';
import { ClassField, StringField, UUIDField } from '../decorators/field.decorators';
import { Association } from '../entities/association.entity';
import { AbstractDto } from './abstract.dto';
import { AssociationDto } from './association.dto';
import { ClassificationDto } from './classification.dto';

export class SpaceDto extends AbstractDto implements Space {
  @StringField()
  name: string;

  @UUIDField()
  classificationId: string;

  @ClassField(() => ClassificationDto, { required: false })
  classification?: ClassificationDto;

  @ClassField(() => AssociationDto, { required: false, each: true })
  associations?: Association[];
}
