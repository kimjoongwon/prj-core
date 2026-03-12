import { PageMetaDto, QueryIdpAccountDto } from "@cocrepo/dto";
import { IdpAccountInfo, IdpAccountService } from "@cocrepo/service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class IdpAccountApplicationService {
	constructor(private readonly idpAccountService: IdpAccountService) {}

	getMany(query: QueryIdpAccountDto): Promise<{
		data: IdpAccountInfo[];
		meta: PageMetaDto;
	}> {
		const skip = query.skip ?? 0;
		const take = query.take ?? 20;

		return this.idpAccountService
			.getMany(query)
			.then(({ data, totalCount }) => ({
				data,
				meta: new PageMetaDto(skip, take, totalCount),
			}));
	}

	getById(userId: string) {
		return this.idpAccountService.getById(userId);
	}

	toggleActive(userId: string) {
		return this.idpAccountService.toggleActive(userId);
	}

	resetFailedAttempts(userId: string): Promise<void> {
		return this.idpAccountService.resetFailedAttempts(userId);
	}
}
