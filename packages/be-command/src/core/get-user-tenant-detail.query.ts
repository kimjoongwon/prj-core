/** 현재 Space에서 사용자에게 속한 Tenant 상세를 조회합니다. */
export class GetUserTenantDetailQuery {
	constructor(
		readonly userId: string,
		readonly tenantId: string,
		readonly spaceId: string,
	) {}
}
