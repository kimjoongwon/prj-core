export class UpdateInquiryPriorityCommand {
	constructor(
		readonly inquiryId: string,
		readonly priority: any,
	) {}
}
