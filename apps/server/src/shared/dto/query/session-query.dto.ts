import { Order } from '../../constant';
import { EnumFieldOptional, StringFieldOptional } from '../../decorator/field.decorators';
import { QueryDto } from './query.dto';

export class SessionQueryDto extends QueryDto {
  @StringFieldOptional({ nullable: true, default: null })
  timelineId: string | null;

  @EnumFieldOptional(() => Order, { default: Order.DESC })
  startDateTimeSortOrder: Order;
}
