import { Ground as GroundEntity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { Space } from './space.entity';
import { UseDto } from '../decorator/use-dto.decorator';
import { GroundDto } from '../dto/ground.dto';

@UseDto(GroundDto)
export class Ground extends AbstractEntity<GroundDto> implements GroundEntity {
  name: string;
  label: string | null;
  address: string;
  phone: string;
  email: string;
  businessNo: string;
  spaceId: string;
  logoImageFileId: string | null;
  imageFileId: string | null;
  space: Space | null;
}
