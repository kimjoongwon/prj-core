import { Order } from '../../constants';
import { StringFieldOptional, EnumFieldOptional } from '../../decorators/field.decorators';
import { QueryDto } from './query.dto';

export class GroupQueryDto extends QueryDto {
  @StringFieldOptional()
  name: string;

  @StringFieldOptional()
  serviceId: string;

  @EnumFieldOptional(() => Order, { default: Order.ASC })
  orderByCreatedAt: Order;
}
