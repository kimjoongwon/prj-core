import { PageMetaDto, QueryOidcSessionDto } from "@cocrepo/dto";
import { OidcRedisSession, OidcSessionService } from "@cocrepo/service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OidcSessionFacade {
	constructor(private readonly oidcSessionService: OidcSessionService) {}

	getMany(query: QueryOidcSessionDto): Promise<{
		data: OidcRedisSession[];
		meta: PageMetaDto;
	}> {
		const skip = query.skip ?? 0;
		const take = query.take ?? 20;

		return this.oidcSessionService.getMany(query).then(({ data, totalCount }) => ({
			data,
			meta: new PageMetaDto(skip, take, totalCount),
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
