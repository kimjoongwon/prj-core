import type { UpdateInquiryCommandInput } from "./update-inquiry.input";

export class UpdateInquiryCommand {
	constructor(
		readonly inquiryId: string,
		readonly input: UpdateInquiryCommandInput,
	) {}
}
