import { PageMetaDto, QueryOidcSessionDto } from "@cocrepo/dto";
import type { OidcRedisSession } from "@cocrepo/service";
import { OidcSessionsService } from "@cocrepo/service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OidcSessionsApplicationService {
	constructor(private readonly oidcSessionsService: OidcSessionsService) {}

	getMany(query: QueryOidcSessionDto): Promise<{
		data: OidcRedisSession[];
		meta: PageMetaDto;
	}> {
		const skip = query.skip ?? 0;
		const take = query.take ?? 20;

		return this.oidcSessionsService.getMany(query).then(({ data, totalCount }) => ({
			data,
			meta: new PageMetaDto(skip, take, totalCount),
		}));
	}

	getStats() {
		return this.oidcSessionsService.getStats();
	}

	revokeByKey(key: string): Promise<void> {
		return this.oidcSessionsService.revokeByKey(key);
	}

	revokeAll(): Promise<number> {
		return this.oidcSessionsService.revokeAll();
	}

	revokeByGrantId(grantId: string): Promise<number> {
		return this.oidcSessionsService.revokeByGrantId(grantId);
	}
}
