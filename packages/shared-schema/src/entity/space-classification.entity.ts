import { SpaceClassification as SpaceClassificationEntity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { Category } from './category.entity';
import { Space } from './space.entity';
import { SpaceClassificationDto } from '../dto';
import { UseDto } from '../decorator/use-dto.decorator';

@UseDto(SpaceClassificationDto)
export class SpaceClassification
  extends AbstractEntity<SpaceClassificationDto>
  implements SpaceClassificationEntity
{
  categoryId: string;
  spaceId: string;

  category?: Category;
  space?: Space;
}
