import { StringField, UUIDField } from '../../../decorators/field.decorators';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { CategoryEntity } from '../category.entity';

export class CategoryDto extends AbstractDto implements CategoryEntity {
  @StringField()
  name: string;

  @StringField({ isArray: true, each: true })
  childrenIds: string[];

  @StringField({ nullable: true })
  parentId: string | null;

  @UUIDField()
  tenantId: string;

  @StringField()
  serviceId: string;
}
