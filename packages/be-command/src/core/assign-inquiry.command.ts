export class AssignInquiryCommand {
	constructor(
		readonly inquiryId: string,
		readonly assigneeId: string,
	) {}
}
