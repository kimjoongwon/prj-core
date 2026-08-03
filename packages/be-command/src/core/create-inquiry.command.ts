import type { CreateInquiryCommandInput } from "@cocrepo/input";
export class CreateInquiryCommand implements CreateInquiryCommandInput {
	readonly title!: CreateInquiryCommandInput["title"];
	readonly category!: CreateInquiryCommandInput["category"];
	readonly channel!: CreateInquiryCommandInput["channel"];
	readonly source?: CreateInquiryCommandInput["source"];
	readonly priority?: CreateInquiryCommandInput["priority"];
	readonly customerId?: CreateInquiryCommandInput["customerId"];
	readonly assigneeId?: CreateInquiryCommandInput["assigneeId"];
	readonly content?: CreateInquiryCommandInput["content"];

	constructor(
		input: CreateInquiryCommandInput,
		readonly spaceId: bigint,
		readonly actorUserId: bigint,
	) {
		Object.assign(this, input);
	}
}
