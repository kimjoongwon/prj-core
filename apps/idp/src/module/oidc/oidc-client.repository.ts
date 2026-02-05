import { PRISMA_SERVICE_TOKEN } from "@cocrepo/constant";
import type { PrismaClient } from "@cocrepo/prisma";
import { Inject, Injectable, Logger } from "@nestjs/common";

export interface OidcClientData {
	clientId: string;
	clientSecret: string | null;
	clientName: string;
	redirectUris: string[];
	grantTypes: string[];
	responseTypes: string[];
	tokenEndpointAuthMethod: string;
	scope: string;
}

/**
 * OIDC Client Repository
 *
 * Global PrismaClient(PRISMA_SERVICE_TOKEN)를 직접 사용하여 OIDC 클라이언트를 조회합니다.
 * CLS 트랜잭션 프록시 대신 원본 PrismaClient를 주입하여 tenant 컨텍스트 없이 동작합니다.
 */
@Injectable()
export class OidcClientRepository {
	private readonly logger = new Logger(OidcClientRepository.name);

	constructor(
		@Inject(PRISMA_SERVICE_TOKEN)
		private readonly prisma: PrismaClient,
	) {}

	async findActiveClients(): Promise<OidcClientData[]> {
		this.logger.debug("활성 OIDC 클라이언트 조회 중...");

		const clients = await this.prisma.oidcClient.findMany({
			where: {
				isActive: true,
				removedAt: null,
			},
		});

		this.logger.log(`${clients.length}개의 OIDC 클라이언트 로드됨`);

		return clients.map((client) => ({
			clientId: client.clientId,
			clientSecret: client.clientSecret,
			clientName: client.clientName,
			redirectUris: client.redirectUris,
			grantTypes: client.grantTypes,
			responseTypes: client.responseTypes,
			tokenEndpointAuthMethod: client.tokenEndpointAuthMethod,
			scope: client.scope,
		}));
	}

	async findByClientId(clientId: string): Promise<OidcClientData | null> {
		this.logger.debug(`클라이언트 조회: ${clientId}`);

		const client = await this.prisma.oidcClient.findUnique({
			where: { clientId },
		});

		if (!client) return null;

		return {
			clientId: client.clientId,
			clientSecret: client.clientSecret,
			clientName: client.clientName,
			redirectUris: client.redirectUris,
			grantTypes: client.grantTypes,
			responseTypes: client.responseTypes,
			tokenEndpointAuthMethod: client.tokenEndpointAuthMethod,
			scope: client.scope,
		};
	}
}
