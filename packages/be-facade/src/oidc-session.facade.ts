import { OidcRedisSession, OidcSessionAggregate } from "@cocrepo/aggregate";
import { PageMetaDto, QueryOidcSessionDto } from "@cocrepo/dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OidcSessionFacade {
	constructor(private readonly oidcSessionService: OidcSessionAggregate) {}

	getMany(query: QueryOidcSessionDto): Promise<{
		data: OidcRedisSession[];
		meta: PageMetaDto;
	}> {
		const skip = query.skip ?? 0;
		const take = query.take ?? 20;

		return this.oidcSessionService.getMany(query).then((oidcSessionResult) => ({
			data: oidcSessionResult.data,
			meta: new PageMetaDto(skip, take, oidcSessionResult.totalCount),
		}));
	}

	getStats() {
		return this.oidcSessionService.getStats();
	}

	revokeByKey(key: string): Promise<void> {
		return this.oidcSessionService.revokeByKey(key);
	}

	revokeAll(): Promise<number> {
		return this.oidcSessionService.revokeAll();
	}

	revokeByGrantId(grantId: string): Promise<number> {
		return this.oidcSessionService.revokeByGrantId(grantId);
	}
}
