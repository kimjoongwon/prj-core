import { Tenancy } from '@prisma/client';
import { AbstractDto, SpaceDto } from '../entities';
import { ClassField, UUIDField } from '../decorators';
export class TenancyDto extends AbstractDto implements Tenancy {
  @UUIDField()
  spaceId: string;

  @ClassField(() => SpaceDto, { nullable: true })
  space: SpaceDto | null;
}
