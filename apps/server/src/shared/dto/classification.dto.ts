import { ClassField, UUIDField} from '../decorator';
import { AbstractDto, CategoryDto } from '.';

export abstract class ClassificationDto extends AbstractDto {
  @UUIDField()
  categoryId: string;

  @ClassField(() => CategoryDto, { required: false })
  category?: CategoryDto;
}
