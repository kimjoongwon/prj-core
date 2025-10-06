import { Order } from "../../constant";
import { EnumFieldOptional, StringFieldOptional } from "../../decorator/field";
import { QueryDto } from "./query.dto";

export class QueryGroupDto extends QueryDto {
	@StringFieldOptional()
	name: string;

	@StringFieldOptional()
	serviceId: string;

	@EnumFieldOptional(() => Order, { default: Order.ASC })
	orderByCreatedAt: Order;
}
