import type { GetInquiryMessagesQueryInput } from "@cocrepo/input";

export class GetInquiryMessagesQuery implements GetInquiryMessagesQueryInput {
	readonly inquirySeq!: GetInquiryMessagesQueryInput["inquirySeq"];
	readonly skip?: GetInquiryMessagesQueryInput["skip"];
	readonly take?: GetInquiryMessagesQueryInput["take"];

	constructor(input: GetInquiryMessagesQueryInput) {
		Object.assign(this, input);
	}
}
