import type { UpdateInquiryCommandInput } from "@cocrepo/input";

export class UpdateInquiryCommand implements UpdateInquiryCommandInput {
	readonly title?: UpdateInquiryCommandInput["title"];
	readonly category?: UpdateInquiryCommandInput["category"];
	readonly status?: UpdateInquiryCommandInput["status"];
	readonly priority?: UpdateInquiryCommandInput["priority"];
	readonly assigneeId?: UpdateInquiryCommandInput["assigneeId"];
	readonly isRealtimeChat?: UpdateInquiryCommandInput["isRealtimeChat"];

	constructor(
		readonly inquiryId: string,
		input: UpdateInquiryCommandInput,
	) {
		Object.assign(this, input);
	}
}
