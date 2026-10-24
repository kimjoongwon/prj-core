export class GetUserDetailForSpaceQuery {
	constructor(
		readonly userSeq: bigint,
		readonly spaceSeq: bigint,
	) {}
}
