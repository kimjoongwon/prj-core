import { EnumFieldOptional, StringFieldOptional } from '../../../decorators/field.decorators';
import { Order } from '../../../constants/order.constant';
import { PageQueryDto } from '../../common';

export class GroupQueryDto extends PageQueryDto {
  @StringFieldOptional()
  name: string;

  @StringFieldOptional()
  serviceId: string;

  @EnumFieldOptional(() => Order, { default: Order.ASC })
  orderByCreatedAt: Order;
}
