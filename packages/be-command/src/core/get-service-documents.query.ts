import type { GetServiceDocumentsQueryInput } from "@cocrepo/input";

export class GetServiceDocumentsQuery implements GetServiceDocumentsQueryInput {
	readonly search?: GetServiceDocumentsQueryInput["search"];
	readonly kind?: GetServiceDocumentsQueryInput["kind"];
	readonly platform?: GetServiceDocumentsQueryInput["platform"];
	readonly status?: GetServiceDocumentsQueryInput["status"];
	readonly locale?: GetServiceDocumentsQueryInput["locale"];
	readonly isRequired?: GetServiceDocumentsQueryInput["isRequired"];
	readonly sort?: GetServiceDocumentsQueryInput["sort"];
	readonly skip?: GetServiceDocumentsQueryInput["skip"];
	readonly take?: GetServiceDocumentsQueryInput["take"];

	constructor(input: GetServiceDocumentsQueryInput) {
		Object.assign(this, input);
	}
}
