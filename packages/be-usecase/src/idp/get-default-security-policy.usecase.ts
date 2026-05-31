import { SecurityPolicyAggregateRoot } from "@cocrepo/aggregate";
import { GetSecurityPolicyQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetSecurityPolicyQuery)
export class GetDefaultSecurityPolicyUseCase
	implements IQueryHandler<GetSecurityPolicyQuery>
{
	constructor(
		private readonly securityPolicyService: SecurityPolicyAggregateRoot,
	) {}

	execute(): Promise<unknown> {
		return this.securityPolicyService.getDefault();
	}
}
