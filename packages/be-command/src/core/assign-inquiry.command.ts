export class AssignInquiryCommand {
	constructor(
		readonly inquiryId: bigint,
		readonly assigneeId: bigint,
	) {}
}
