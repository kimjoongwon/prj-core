import { IdpAccountAggregate } from "@cocrepo/aggregate";
import { GetIdpAccountAccessGrantFormQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetIdpAccountAccessGrantFormQuery)
export class GetIdpAccountAccessGrantFormBootstrapUseCase {
	constructor(private readonly idpAccountService: IdpAccountAggregate) {}

	execute(query: GetIdpAccountAccessGrantFormQuery): Promise<unknown> {
		return this.idpAccountService.getAccessGrantFormBootstrap(query.userId);
	}
}
