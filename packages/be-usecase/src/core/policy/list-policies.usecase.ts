import { PolicyAggregateRoot } from "@cocrepo/aggregate";
import { ListPoliciesQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(ListPoliciesQuery)
export class ListPoliciesUseCase implements IQueryHandler<ListPoliciesQuery> {
	constructor(private readonly policyService: PolicyAggregateRoot) {}

	execute(): Promise<unknown> {
		return this.policyService.listPolicies();
	}
}
