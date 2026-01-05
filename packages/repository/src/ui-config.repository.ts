import { UIConfig } from "@cocrepo/entity";
import { Prisma, PrismaClient, UIConfigScope } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

/**
 * 우선순위에 따른 설정 조회 파라미터
 */
export interface FindEffectiveParams {
	spaceId: string;
	entity: string;
	view: string;
	userId?: string;
	roleId?: string;
}

@Injectable()
export class UIConfigRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("UIConfigRepository");
	}

	/**
	 * 우선순위에 따른 설정 조회 (USER > ROLE > GLOBAL)
	 *
	 * 가장 구체적인 설정을 반환합니다:
	 * - USER 설정이 있으면 USER 설정 반환
	 * - 없으면 ROLE 설정 확인
	 * - ROLE 설정도 없으면 GLOBAL 설정 반환
	 */
	async findEffective(params: FindEffectiveParams): Promise<UIConfig | null> {
		const { spaceId, entity, view, userId, roleId } = params;

		this.logger.debug(
			`우선순위에 따른 설정 조회: entity=${entity}, view=${view}, spaceId=${spaceId.slice(-8)}`,
		);

		// 우선순위 조건 구성
		const orConditions: Prisma.UIConfigWhereInput[] = [
			{ scope: UIConfigScope.GLOBAL, scopeId: null },
		];

		if (roleId) {
			orConditions.push({ scope: UIConfigScope.ROLE, scopeId: roleId });
		}

		if (userId) {
			orConditions.push({ scope: UIConfigScope.USER, scopeId: userId });
		}

		const configs = await this.txHost.tx.uIConfig.findMany({
			where: {
				spaceId,
				entity,
				view,
				removedAt: null,
				OR: orConditions,
			},
			include: {
				space: true,
			},
		});

		// 우선순위에 따라 정렬: USER > ROLE > GLOBAL
		const priorityOrder: Record<UIConfigScope, number> = {
			[UIConfigScope.USER]: 3,
			[UIConfigScope.ROLE]: 2,
			[UIConfigScope.GLOBAL]: 1,
		};

		const sorted = configs.sort(
			(a, b) => priorityOrder[b.scope] - priorityOrder[a.scope],
		);

		const result = sorted[0] ?? null;

		if (result) {
			this.logger.debug(
				`설정 발견: scope=${result.scope}, id=${result.id.slice(-8)}`,
			);
		} else {
			this.logger.debug("설정 없음, 코드 기본값 사용");
		}

		return result ? plainToInstance(UIConfig, result) : null;
	}

	/**
	 * 엔티티+뷰별 모든 설정 조회
	 *
	 * 특정 엔티티와 뷰에 대한 모든 범위(GLOBAL, ROLE, USER)의 설정을 조회합니다.
	 */
	async findByEntityView(
		entity: string,
		view: string,
		spaceId: string,
	): Promise<UIConfig[]> {
		this.logger.debug(
			`엔티티+뷰별 설정 조회: entity=${entity}, view=${view}, spaceId=${spaceId.slice(-8)}`,
		);

		const results = await this.txHost.tx.uIConfig.findMany({
			where: {
				entity,
				view,
				spaceId,
				removedAt: null,
			},
			include: {
				space: true,
			},
			orderBy: [{ scope: "asc" }, { createdAt: "desc" }],
		});

		return results.map((result) => plainToInstance(UIConfig, result));
	}

	/**
	 * 설정 저장 또는 업데이트 (Upsert)
	 *
	 * 동일한 조건(spaceId, entity, view, scope, scopeId)의 설정이 있으면 업데이트,
	 * 없으면 새로 생성합니다.
	 */
	async upsert(data: Prisma.UIConfigUncheckedCreateInput): Promise<UIConfig> {
		const { spaceId, entity, view, scope, scopeId, config } = data;

		this.logger.debug(
			`설정 저장/업데이트: entity=${entity}, view=${view}, scope=${scope}`,
		);

		const result = await this.txHost.tx.uIConfig.upsert({
			where: {
				spaceId_entity_view_scope_scopeId: {
					spaceId,
					entity,
					view,
					scope: scope ?? UIConfigScope.GLOBAL,
					scopeId: scopeId ?? "",
				},
			},
			create: {
				spaceId,
				entity,
				view,
				scope: scope ?? UIConfigScope.GLOBAL,
				scopeId: scopeId ?? null,
				config,
			},
			update: {
				config,
				updatedAt: new Date(),
			},
			include: {
				space: true,
			},
		});

		return plainToInstance(UIConfig, result);
	}

	/**
	 * ID로 설정 조회
	 */
	async findById(id: string): Promise<UIConfig | null> {
		this.logger.debug(`ID로 설정 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.uIConfig.findUnique({
			where: { id },
			include: {
				space: true,
			},
		});

		return result ? plainToInstance(UIConfig, result) : null;
	}

	/**
	 * 설정 삭제 (물리 삭제)
	 *
	 * 설정을 삭제하면 코드 기본값이 적용됩니다.
	 */
	async deleteById(id: string): Promise<UIConfig> {
		this.logger.debug(`설정 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.uIConfig.delete({
			where: { id },
			include: {
				space: true,
			},
		});

		return plainToInstance(UIConfig, result);
	}

	/**
	 * 설정 소프트 삭제
	 */
	async removeById(id: string): Promise<UIConfig> {
		this.logger.debug(`설정 소프트 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.uIConfig.update({
			where: { id },
			data: { removedAt: new Date() },
			include: {
				space: true,
			},
		});

		return plainToInstance(UIConfig, result);
	}

	/**
	 * 사용자별 모든 설정 조회
	 */
	async findManyByUserId(userId: string, spaceId: string): Promise<UIConfig[]> {
		this.logger.debug(
			`사용자별 설정 조회: userId=${userId.slice(-8)}, spaceId=${spaceId.slice(-8)}`,
		);

		const results = await this.txHost.tx.uIConfig.findMany({
			where: {
				spaceId,
				scope: UIConfigScope.USER,
				scopeId: userId,
				removedAt: null,
			},
			include: {
				space: true,
			},
			orderBy: { createdAt: "desc" },
		});

		return results.map((result) => plainToInstance(UIConfig, result));
	}

	/**
	 * 역할별 모든 설정 조회
	 */
	async findManyByRoleId(roleId: string, spaceId: string): Promise<UIConfig[]> {
		this.logger.debug(
			`역할별 설정 조회: roleId=${roleId.slice(-8)}, spaceId=${spaceId.slice(-8)}`,
		);

		const results = await this.txHost.tx.uIConfig.findMany({
			where: {
				spaceId,
				scope: UIConfigScope.ROLE,
				scopeId: roleId,
				removedAt: null,
			},
			include: {
				space: true,
			},
			orderBy: { createdAt: "desc" },
		});

		return results.map((result) => plainToInstance(UIConfig, result));
	}
}
