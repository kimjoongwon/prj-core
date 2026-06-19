export class UpdateInquiryStatusCommand {
	constructor(
		readonly inquiryId: string,
		readonly status: any,
	) {}
}
