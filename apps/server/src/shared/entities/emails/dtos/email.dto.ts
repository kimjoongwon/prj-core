import { DateField, StringField, UUIDField } from '../../../decorators';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Email } from '../email.entity';

export class EmailDto extends AbstractDto implements Email {
  @StringField({ isArray: true })
  toUserIds: string[];

  @UUIDField()
  fromUserId: string;

  @UUIDField()
  postId: string;

  @DateField()
  sentAt: Date;
}
