import type { QueryPaymentDto } from "@cocrepo/dto";

export class GetPaymentsQuery {
	constructor(readonly query: QueryPaymentDto) {}
}
