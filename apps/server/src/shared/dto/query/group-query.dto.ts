import { Order } from '../../constant';
import { StringFieldOptional, EnumFieldOptional } from '../../decorator/field.decorators';
import { QueryDto } from './query.dto';

export class GroupQueryDto extends QueryDto {
  @StringFieldOptional()
  name: string;

  @StringFieldOptional()
  serviceId: string;

  @EnumFieldOptional(() => Order, { default: Order.ASC })
  orderByCreatedAt: Order;
}
