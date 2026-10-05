export class GetUserDetailForSpaceQuery {
	constructor(
		readonly userId: bigint,
		readonly spaceId: bigint,
	) {}
}
