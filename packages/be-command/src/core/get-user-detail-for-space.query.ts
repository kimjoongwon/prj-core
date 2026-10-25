export class GetUserDetailForSpaceQuery {
	constructor(
		readonly userId: string,
		readonly spaceId: string,
	) {}
}
