import {
	CreateOidcClientDto,
	PageMetaDto,
	QueryOidcClientDto,
	UpdateOidcClientDto,
} from "@cocrepo/dto";
import { OidcClient } from "@cocrepo/entity";
import { OidcClientService } from "@cocrepo/service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OidcClientFacade {
	constructor(private readonly oidcClientService: OidcClientService) {}

	getMany(query: QueryOidcClientDto): Promise<{
		data: OidcClient[];
		meta: PageMetaDto;
	}> {
		const skip = query.skip ?? 0;
		const take = query.take ?? 20;

		return this.oidcClientService.getMany(query).then(({ data, totalCount }) => ({
			data,
			meta: new PageMetaDto(skip, take, totalCount),
		}));
	}

	getById(oidcClientId: string): Promise<OidcClient> {
		return this.oidcClientService.getById(oidcClientId);
	}

	create(dto: CreateOidcClientDto): Promise<OidcClient> {
		return this.oidcClientService.create({
			clientId: dto.clientId,
			clientSecret: dto.clientSecret,
			name: dto.name,
			redirectUris: dto.redirectUris,
			loginUrl: dto.loginUrl,
			defaultReturnTo: dto.defaultReturnTo,
			grantTypes: dto.grantTypes,
			responseTypes: dto.responseTypes,
			tokenEndpointAuthMethod: dto.tokenEndpointAuthMethod,
			scope: dto.scope,
			logoUri: dto.logoUri,
			policyUri: dto.policyUri,
			tosUri: dto.tosUri,
		});
	}

	update(oidcClientId: string, dto: UpdateOidcClientDto): Promise<OidcClient> {
		return this.oidcClientService.update(oidcClientId, dto);
	}

	remove(oidcClientId: string): Promise<void> {
		return this.oidcClientService.remove(oidcClientId);
	}

	toggleActive(oidcClientId: string): Promise<OidcClient> {
		return this.oidcClientService.toggleActive(oidcClientId);
	}
}
