import type { CreateInquiryCommandInput } from "./create-inquiry.input";
export class CreateInquiryCommand {
	constructor(
		readonly input: CreateInquiryCommandInput,
		readonly spaceId: string,
		readonly actorUserId: string,
	) {}
}
