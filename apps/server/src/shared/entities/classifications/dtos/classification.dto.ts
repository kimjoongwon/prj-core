import { ClassField, UUIDField } from '../../../decorators';
import { CategoryDto } from '../../categories';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Classification } from '../classification.entity';

export class ClassificationDto extends AbstractDto implements Classification {
  @UUIDField()
  categoryId: string;

  @ClassField(() => CategoryDto, { required: false })
  category?: CategoryDto;
}
