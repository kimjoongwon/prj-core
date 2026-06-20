import { PolicyAggregate } from "@cocrepo/aggregate";
import { ListPoliciesQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(ListPoliciesQuery)
export class ListPoliciesUseCase {
	constructor(private readonly policyService: PolicyAggregate) {}

	execute(): Promise<unknown> {
		return this.policyService.listPolicies();
	}
}
