import {
  EnumFieldOptional,
  Order,
  PageOptionsDto,
  StringFieldOptional,
} from '@shared';

export class GroupPageOptionsDto extends PageOptionsDto {
  @StringFieldOptional()
  name: string;

  @EnumFieldOptional(() => Order, { default: Order.ASC })
  orderByCreatedAt: Order;
}
