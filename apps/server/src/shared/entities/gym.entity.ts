import { Gym as GymEntity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { GymDto } from '../dtos/gym.dto';
import { UseDto } from '../decorators/use-dto.decorator';
import { DepotDto, SpaceDto } from '../dtos';

@UseDto(GymDto)
export class Gym extends AbstractEntity<GymDto> implements GymEntity {
  name: string;
  label: string;
  businessNo: string;
  spaceId: string;
  address: string;
  phone: string;
  email: string;
  businessNumber: string;
  depotId: string | null;
  depot?: DepotDto;
  space?: SpaceDto;
}
