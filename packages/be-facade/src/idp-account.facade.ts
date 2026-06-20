import { IdpAccountAggregate, IdpAccountInfo } from "@cocrepo/aggregate";
import {
	GrantIdpAccountAccessDto,
	PageMetaDto,
	QueryIdpAccountDto,
} from "@cocrepo/dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class IdpAccountFacade {
	constructor(private readonly idpAccountService: IdpAccountAggregate) {}

	getMany(query: QueryIdpAccountDto): Promise<{
		data: IdpAccountInfo[];
		meta: PageMetaDto;
	}> {
		const skip = query.skip ?? 0;
		const take = query.take ?? 20;

		return this.idpAccountService.getMany(query).then((idpAccountResult) => ({
			data: idpAccountResult.data,
			meta: new PageMetaDto(skip, take, idpAccountResult.totalCount),
		}));
	}

	getById(userId: string) {
		return this.idpAccountService.getById(userId);
	}

	getAccessGrantFormBootstrap(userId: string) {
		return this.idpAccountService.getAccessGrantFormBootstrap(userId);
	}

	grantAccess(userId: string, dto: GrantIdpAccountAccessDto) {
		return this.idpAccountService.grantAccess(userId, dto);
	}

	toggleActive(userId: string) {
		return this.idpAccountService.toggleActive(userId);
	}

	resetFailedAttempts(userId: string): Promise<void> {
		return this.idpAccountService.resetFailedAttempts(userId);
	}
}
