import { StringField } from '../../../decorators/field.decorators';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { CategoryEntity } from '../category.entity';

export class CategoryDto extends AbstractDto {
  @StringField()
  name: string;

  @StringField({ isArray: true, each: true })
  ancestorIds: string[];

  @StringField({ nullable: true })
  parentId: string | null;

  @StringField()
  spaceId: string;

  @StringField()
  serviceId: string;
}
