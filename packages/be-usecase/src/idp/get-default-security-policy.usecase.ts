import { SecurityPolicyAggregate } from "@cocrepo/aggregate";
import { GetSecurityPolicyQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetSecurityPolicyQuery)
export class GetDefaultSecurityPolicyUseCase {
	constructor(
		private readonly securityPolicyService: SecurityPolicyAggregate,
	) {}

	execute(): Promise<unknown> {
		return this.securityPolicyService.getDefault();
	}
}
