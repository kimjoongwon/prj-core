import type { QueryOidcClientDto } from "@cocrepo/dto";
import type { OidcClient } from "@cocrepo/entity";
import { OidcClientsRepository } from "@cocrepo/repository";
import {
	ConflictException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";

@Injectable()
export class OidcClientService {
	private readonly logger = new Logger(OidcClientService.name);

	constructor(private readonly repository: OidcClientsRepository) {}

	async getMany(query: QueryOidcClientDto): Promise<{
		data: OidcClient[];
		totalCount: number;
	}> {
		this.logger.debug("OIDC 클라이언트 목록 조회");

		const where = query.toPrismaWhere({ removedAt: null });
		const orderBy = query.toPrismaOrderBy();

		return this.repository.findMany({
			where,
			orderBy,
			skip: query.skip ?? 0,
			take: query.take ?? 20,
		});
	}

	async getById(id: string): Promise<OidcClient> {
		this.logger.debug(`OIDC 클라이언트 상세 조회: ${id.slice(-8)}`);

		const client = await this.repository.findById(id);
		if (!client) {
			throw new NotFoundException("OIDC 클라이언트를 찾을 수 없습니다");
		}

		return client;
	}

	async create(params: {
		clientId: string;
		clientSecret?: string | null;
		clientName: string;
		redirectUris: string[];
		grantTypes: string[];
		responseTypes: string[];
		tokenEndpointAuthMethod: string;
		scope: string;
		logoUri?: string | null;
		policyUri?: string | null;
		tosUri?: string | null;
	}): Promise<OidcClient> {
		this.logger.debug(`OIDC 클라이언트 생성: ${params.clientId}`);

		const existing = await this.repository.findByClientId(params.clientId);
		if (existing) {
			throw new ConflictException("이미 존재하는 Client ID입니다");
		}

		return this.repository.create({
			clientId: params.clientId,
			clientSecret: params.clientSecret ?? null,
			clientName: params.clientName,
			redirectUris: params.redirectUris,
			grantTypes: params.grantTypes,
			responseTypes: params.responseTypes,
			tokenEndpointAuthMethod: params.tokenEndpointAuthMethod,
			scope: params.scope,
			isActive: true,
			logoUri: params.logoUri ?? null,
			policyUri: params.policyUri ?? null,
			tosUri: params.tosUri ?? null,
		});
	}

	async update(
		id: string,
		params: {
			clientSecret?: string | null;
			clientName?: string;
			redirectUris?: string[];
			grantTypes?: string[];
			responseTypes?: string[];
			tokenEndpointAuthMethod?: string;
			scope?: string;
			logoUri?: string | null;
			policyUri?: string | null;
			tosUri?: string | null;
		},
	): Promise<OidcClient> {
		this.logger.debug(`OIDC 클라이언트 수정: ${id.slice(-8)}`);

		const existing = await this.repository.findById(id);
		if (!existing) {
			throw new NotFoundException("OIDC 클라이언트를 찾을 수 없습니다");
		}

		return this.repository.updateById(id, params);
	}

	async remove(id: string): Promise<void> {
		this.logger.debug(`OIDC 클라이언트 삭제: ${id.slice(-8)}`);

		const existing = await this.repository.findById(id);
		if (!existing) {
			throw new NotFoundException("OIDC 클라이언트를 찾을 수 없습니다");
		}

		await this.repository.removeById(id);
	}

	async toggleActive(id: string): Promise<OidcClient> {
		this.logger.debug(`OIDC 클라이언트 활성 토글: ${id.slice(-8)}`);

		const existing = await this.repository.findById(id);
		if (!existing) {
			throw new NotFoundException("OIDC 클라이언트를 찾을 수 없습니다");
		}

		return this.repository.updateById(id, {
			isActive: !existing.isActive,
		});
	}
}
