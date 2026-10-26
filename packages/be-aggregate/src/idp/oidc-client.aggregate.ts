import type { OidcClient } from "@cocrepo/entity";
import { OidcClientsRepository } from "@cocrepo/repository";
import { OidcClientId } from "@cocrepo/vo";
import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";

@Injectable()
export class OidcClientAggregate {
	private readonly logger = new Logger(OidcClientAggregate.name);

	constructor(private readonly repository: OidcClientsRepository) {}

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

	async getLoginPageClientByClientId(params: {
		clientId: string;
		requireActive?: boolean;
	}): Promise<OidcClient> {
		const client = await this.getByClientId(params.clientId);

		if (params.requireActive !== false && !client.isActive) {
			throw new BadRequestException("비활성화된 OIDC 클라이언트입니다");
		}

		if (!client.loginUrl || !client.defaultReturnTo) {
			throw new BadRequestException(
				"로그인 화면 URL과 기본 복귀 URL이 설정되지 않았습니다",
			);
		}

		if (client.redirectUris.length === 0 || !client.redirectUris[0]) {
			throw new BadRequestException("Redirect URI가 설정되지 않았습니다");
		}

		return client;
	}

	private toClientId(clientId: string): OidcClientId {
		try {
			return OidcClientId.create(clientId);
		} catch {
			throw new BadRequestException("OIDC Client ID 형식이 올바르지 않습니다");
		}
	}
}
