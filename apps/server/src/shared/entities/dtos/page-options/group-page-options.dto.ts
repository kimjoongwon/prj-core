import { Order } from '../../../constants/order.constant';
import {
  EnumFieldOptional,
  StringFieldOptional,
} from '../../../decorators/field.decorators';
import { PageOptionsDto } from '../common/page-option.dto';

export class GroupPageOptionsDto extends PageOptionsDto {
  @StringFieldOptional()
  name: string;

  @EnumFieldOptional(() => Order, { default: Order.ASC })
  orderByCreatedAt: Order;
}
