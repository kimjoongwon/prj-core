import type { GetPaymentsQueryInput } from "@cocrepo/input";

export class GetPaymentsQuery implements GetPaymentsQueryInput {
	readonly search?: GetPaymentsQueryInput["search"];
	readonly tenantId?: GetPaymentsQueryInput["tenantId"];
	readonly payerUserId?: GetPaymentsQueryInput["payerUserId"];
	readonly status?: GetPaymentsQueryInput["status"];
	readonly method?: GetPaymentsQueryInput["method"];
	readonly provider?: GetPaymentsQueryInput["provider"];
	readonly providerOrderId?: GetPaymentsQueryInput["providerOrderId"];
	readonly subjectType?: GetPaymentsQueryInput["subjectType"];
	readonly subjectId?: GetPaymentsQueryInput["subjectId"];
	readonly referenceType?: GetPaymentsQueryInput["referenceType"];
	readonly referenceId?: GetPaymentsQueryInput["referenceId"];
	readonly approvedFrom?: GetPaymentsQueryInput["approvedFrom"];
	readonly approvedUntil?: GetPaymentsQueryInput["approvedUntil"];
	readonly sort?: GetPaymentsQueryInput["sort"];
	readonly skip?: GetPaymentsQueryInput["skip"];
	readonly take?: GetPaymentsQueryInput["take"];

	constructor(input: GetPaymentsQueryInput) {
		Object.assign(this, input);
	}
}
