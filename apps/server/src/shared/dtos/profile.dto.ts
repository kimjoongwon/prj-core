import { StringField, UUIDField } from '../../decorators/field.decorators';
import { AbstractDto } from '../common/dtos/abstract.dto';
import { ProfileEntity } from '../profile.entity';

export class ProfileDto extends AbstractDto implements ProfileEntity {
  @UUIDField({ nullable: true })
  depotFileId: string | null;

  @StringField()
  nickname: string;

  @StringField()
  userId: string;
}
