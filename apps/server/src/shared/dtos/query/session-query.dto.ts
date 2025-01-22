import { Order } from '../../constants';
import { EnumFieldOptional, StringFieldOptional } from '../../decorators/field.decorators';
import { QueryDto } from './query.dto';

export class SessionQueryDto extends QueryDto {
  @StringFieldOptional({ nullable: true, default: null })
  timelineId: string | null;

  @EnumFieldOptional(() => Order, { default: Order.DESC })
  startDateTimeSortOrder: Order;
}
