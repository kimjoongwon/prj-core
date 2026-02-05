import { PRISMA_SERVICE_TOKEN } from "@cocrepo/constant";
import type { PrismaClient } from "@cocrepo/prisma";
import { Inject, Injectable, Logger } from "@nestjs/common";

/**
 * IDP 전용 Direct User Repository
 *
 * Global PrismaClient(PRISMA_SERVICE_TOKEN)를 직접 사용하여 사용자를 조회합니다.
 * IDP의 OIDC 인증 흐름에서는 tenant 컨텍스트 없이 사용자를 조회해야 하므로
 * CLS 트랜잭션 프록시(txHost.tx) 대신 원본 PrismaClient를 직접 주입합니다.
 */
@Injectable()
export class DirectUserRepository {
	private readonly logger = new Logger(DirectUserRepository.name);

	constructor(
		@Inject(PRISMA_SERVICE_TOKEN)
		private readonly prisma: PrismaClient,
	) {}

	/**
	 * 이메일로 인증용 경량 조회 (id, email, password만)
	 * 로그인 비밀번호 검증 시 사용합니다.
	 */
	async findByEmailForAuth(
		email: string,
	): Promise<{ id: string; email: string; password: string } | null> {
		this.logger.debug(`인증용 이메일 조회: ${email}`);

		return this.prisma.user.findUnique({
			where: { email },
			select: { id: true, email: true, password: true },
		});
	}

	/**
	 * ID로 사용자 조회 (Tenants 포함)
	 * AccountService의 claims 빌드에 사용합니다.
	 */
	async findByIdWithTenants(id: string) {
		this.logger.debug(`ID로 사용자 조회: ${id.slice(-8)}`);

		return this.prisma.user.findUnique({
			where: { id },
			include: {
				tenants: {
					include: {
						role: true,
						space: {
							include: {
								ground: true,
							},
						},
					},
				},
			},
		});
	}
}
