export class AssignInquiryCommand {
	constructor(
		readonly inquirySeq: bigint,
		readonly assigneeSeq: bigint,
	) {}
}
