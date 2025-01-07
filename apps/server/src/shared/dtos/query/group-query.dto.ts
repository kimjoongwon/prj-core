import { EnumFieldOptional, StringFieldOptional } from '../../../decorators/field.decorators';
import { Order } from '../../../constants/order.constant';
import { QueryDto } from '../../common';

export class GroupQueryDto extends QueryDto {
  @StringFieldOptional()
  name: string;

  @StringFieldOptional()
  serviceId: string;

  @EnumFieldOptional(() => Order, { default: Order.ASC })
  orderByCreatedAt: Order;
}
