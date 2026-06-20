import type { QueryOidcClientDto } from "@cocrepo/dto";
import type { OidcClient } from "@cocrepo/entity";
import { Prisma } from "@cocrepo/prisma";
import { OidcClientsRepository } from "@cocrepo/repository";
import type { JsonValue } from "@cocrepo/type";
import { OidcClientId, RedirectUri } from "@cocrepo/vo";
import {
	BadRequestException,
	ConflictException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";

@Injectable()
export class OidcClientAggregate {
	private readonly logger = new Logger(OidcClientAggregate.name);

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
		name: string;
		redirectUris: string[];
		loginUrl?: string | null;
		defaultReturnTo?: string | null;
		grantTypes: string[];
		responseTypes: string[];
		tokenEndpointAuthMethod: string;
		scope: string;
		isFirstParty: boolean;
		skipConsent?: boolean;
		loginUi?: JsonValue | null;
		logoUri?: string | null;
		policyUri?: string | null;
		tosUri?: string | null;
	}): Promise<OidcClient> {
		const clientId = this.toClientId(params.clientId);
		const redirectUris = this.toRedirectUris(params.redirectUris);

		this.logger.debug(`OIDC 클라이언트 생성: ${clientId.value}`);

		const existing = await this.repository.findByClientId(clientId.value);
		if (existing) {
			throw new ConflictException("이미 존재하는 Client ID입니다");
		}
		const isFirstParty = params.isFirstParty ?? false;
		const skipConsent = params.skipConsent ?? false;
		this.validateConsentPolicy({ isFirstParty, skipConsent });

		return this.repository.create({
			clientId: clientId.value,
			clientSecret: params.clientSecret ?? null,
			name: params.name,
			redirectUris,
			loginUrl: params.loginUrl ?? null,
			defaultReturnTo: params.defaultReturnTo ?? null,
			grantTypes: params.grantTypes,
			responseTypes: params.responseTypes,
			tokenEndpointAuthMethod: params.tokenEndpointAuthMethod,
			scope: params.scope,
			isActive: true,
			isFirstParty,
			skipConsent,
			loginUi: this.toPrismaNullableJson(params.loginUi) ?? Prisma.DbNull,
			logoUri: params.logoUri ?? null,
			policyUri: params.policyUri ?? null,
			tosUri: params.tosUri ?? null,
		});
	}

	async update(
		id: string,
		params: {
			clientSecret?: string | null;
			name?: string;
			redirectUris?: string[];
			loginUrl?: string | null;
			defaultReturnTo?: string | null;
			grantTypes?: string[];
			responseTypes?: string[];
			tokenEndpointAuthMethod?: string;
			scope?: string;
			isFirstParty?: boolean;
			skipConsent?: boolean;
			loginUi?: JsonValue | null;
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
		this.validateConsentPolicy({
			isFirstParty: params.isFirstParty ?? existing.isFirstParty,
			skipConsent: params.skipConsent ?? existing.skipConsent,
		});
		const redirectUris = params.redirectUris
			? this.toRedirectUris(params.redirectUris)
			: undefined;

		const updateData: Prisma.OidcClientUncheckedUpdateInput = {
			...params,
			redirectUris,
			loginUi: this.toPrismaNullableJson(params.loginUi),
		};

		return this.repository.updateById(id, updateData);
	}

	async getByClientId(clientId: string): Promise<OidcClient> {
		const normalizedClientId = this.toClientId(clientId);
		this.logger.debug(`OIDC 클라이언트 조회: ${normalizedClientId.value}`);

		const client = await this.repository.findByClientId(
			normalizedClientId.value,
		);
		if (!client || client.removedAt) {
			throw new NotFoundException("OIDC 클라이언트를 찾을 수 없습니다");
		}

		return client;
	}

	async getAuthShellClientByClientId(params: {
		clientId: string;
		requireActive?: boolean;
	}): Promise<OidcClient> {
		const client = await this.getByClientId(params.clientId);

		if (params.requireActive !== false && !client.isActive) {
			throw new BadRequestException("비활성화된 OIDC 클라이언트입니다");
		}

		if (!client.loginUrl || !client.defaultReturnTo) {
			throw new BadRequestException(
				"로그인 셸 URL과 기본 복귀 URL이 설정되지 않았습니다",
			);
		}

		if (client.redirectUris.length === 0 || !client.redirectUris[0]) {
			throw new BadRequestException("Redirect URI가 설정되지 않았습니다");
		}

		return client;
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

	private validateConsentPolicy(params: {
		isFirstParty: boolean;
		skipConsent: boolean;
	}): void {
		if (!params.skipConsent) {
			return;
		}

		if (!params.isFirstParty) {
			throw new BadRequestException(
				"권한 동의 화면 생략은 first-party OIDC 클라이언트에만 설정할 수 있습니다",
			);
		}
	}

	private toClientId(clientId: string): OidcClientId {
		try {
			return OidcClientId.create(clientId);
		} catch {
			throw new BadRequestException("OIDC Client ID 형식이 올바르지 않습니다");
		}
	}

	private toRedirectUris(redirectUris: string[]): string[] {
		try {
			return redirectUris.map((uri) => RedirectUri.create(uri).value);
		} catch {
			throw new BadRequestException("Redirect URI 형식이 올바르지 않습니다");
		}
	}

	private toPrismaNullableJson(
		value: JsonValue | null | undefined,
	): Prisma.OidcClientUncheckedCreateInput["loginUi"] | undefined {
		if (value === undefined) {
			return undefined;
		}

		if (value === null) {
			return Prisma.DbNull;
		}

		return value as Prisma.InputJsonValue;
	}
}
