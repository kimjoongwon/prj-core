import {
	CreateOidcClientDto,
	OidcClientDto,
	QueryOidcClientDto,
	PageMetaDto,
	UpdateOidcClientDto,
} from "@cocrepo/dto";
import { OidcClient } from "@cocrepo/entity";
import { OidcClientsService } from "@cocrepo/service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OidcClientsApplicationService {
	constructor(private readonly oidcClientsService: OidcClientsService) {}

	getMany(query: QueryOidcClientDto): Promise<{
		data: OidcClient[];
		meta: PageMetaDto;
	}> {
		const skip = query.skip ?? 0;
		const take = query.take ?? 20;

		return this.oidcClientsService.getMany(query).then(({ data, totalCount }) => ({
			data,
			meta: new PageMetaDto(skip, take, totalCount),
		}));
	}

	getById(oidcClientId: string): Promise<OidcClient> {
		return this.oidcClientsService.getById(oidcClientId);
	}

	create(dto: CreateOidcClientDto): Promise<OidcClient> {
		return this.oidcClientsService.create({
			clientId: dto.clientId,
			clientSecret: dto.clientSecret,
			clientName: dto.clientName,
			redirectUris: dto.redirectUris,
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
		return this.oidcClientsService.update(oidcClientId, dto);
	}

	remove(oidcClientId: string): Promise<void> {
		return this.oidcClientsService.remove(oidcClientId);
	}

	toggleActive(oidcClientId: string): Promise<OidcClient> {
		return this.oidcClientsService.toggleActive(oidcClientId);
	}
}
