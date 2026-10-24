import type { CreateInquiryCommandInput } from "@cocrepo/input";
export class CreateInquiryCommand implements CreateInquiryCommandInput {
	readonly title!: CreateInquiryCommandInput["title"];
	readonly category!: CreateInquiryCommandInput["category"];
	readonly channel!: CreateInquiryCommandInput["channel"];
	readonly source?: CreateInquiryCommandInput["source"];
	readonly priority?: CreateInquiryCommandInput["priority"];
	readonly customerSeq?: CreateInquiryCommandInput["customerSeq"];
	readonly assigneeSeq?: CreateInquiryCommandInput["assigneeSeq"];
	readonly content?: CreateInquiryCommandInput["content"];

	constructor(
		input: CreateInquiryCommandInput,
		readonly spaceSeq: bigint,
		readonly actorUserId: bigint,
	) {
		Object.assign(this, input);
	}
}
