import type { GetInquiryMessagesQueryInput } from "@cocrepo/input";

export class GetInquiryMessagesQuery implements GetInquiryMessagesQueryInput {
	readonly inquiryId!: GetInquiryMessagesQueryInput["inquiryId"];
	readonly skip?: GetInquiryMessagesQueryInput["skip"];
	readonly take?: GetInquiryMessagesQueryInput["take"];

	constructor(input: GetInquiryMessagesQueryInput) {
		Object.assign(this, input);
	}
}
