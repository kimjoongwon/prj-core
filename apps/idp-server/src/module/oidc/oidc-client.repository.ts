import { Injectable, Logger } from "@nestjs/common";
import { DirectPrismaProvider } from "./direct-prisma.provider";

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
 * DirectPrismaProvider를 사용하여 CLS 트랜잭션 프록시를 우회합니다.
 * onModuleInit 시점(HTTP 요청 컨텍스트 바깥)에서 호출되므로
 * CLS 프록시가 감싼 PRISMA_SERVICE_TOKEN 대신 별도의 PrismaClient를 사용해야 합니다.
 */
@Injectable()
export class OidcClientRepository {
	private readonly logger = new Logger(OidcClientRepository.name);

	constructor(
		private readonly directPrismaProvider: DirectPrismaProvider,
	) {}

	async findActiveClients(): Promise<OidcClientData[]> {
		this.logger.debug("활성 OIDC 클라이언트 조회 중...");

		const prisma = await this.directPrismaProvider.getClient();
		const clients = await prisma.oidcClient.findMany({
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

		const prisma = await this.directPrismaProvider.getClient();
		const client = await prisma.oidcClient.findUnique({
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
