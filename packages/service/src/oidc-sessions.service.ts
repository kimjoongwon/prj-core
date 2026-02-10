import type { QueryOidcSessionDto } from "@cocrepo/dto";
import type { OidcModel } from "@cocrepo/entity";
import { OidcModelsRepository } from "@cocrepo/repository";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";

@Injectable()
export class OidcSessionsService {
	private readonly logger = new Logger(OidcSessionsService.name);

	constructor(private readonly repository: OidcModelsRepository) {}

	async getMany(query: QueryOidcSessionDto): Promise<{
		data: OidcModel[];
		totalCount: number;
	}> {
		this.logger.debug("OIDC 세션/토큰 목록 조회");

		const where = query.toPrismaWhere();
		const orderBy = query.toPrismaOrderBy();

		return this.repository.findMany({
			where,
			orderBy,
			skip: query.skip ?? 0,
			take: query.take ?? 20,
		});
	}

	async revokeByKey(key: string): Promise<void> {
		this.logger.debug(`세션/토큰 단건 폐기: ${key.slice(0, 8)}...`);

		const existing = await this.repository.findByKey(key);
		if (!existing) {
			throw new NotFoundException("세션/토큰을 찾을 수 없습니다");
		}

		await this.repository.deleteByKey(key);
	}

	async revokeByGrantId(grantId: string): Promise<number> {
		this.logger.debug(`Grant 일괄 폐기: ${grantId.slice(0, 8)}...`);

		const models = await this.repository.findManyByGrantId(grantId);
		if (models.length === 0) {
			throw new NotFoundException(
				"해당 Grant에 연결된 세션/토큰이 없습니다",
			);
		}

		return this.repository.deleteManyByGrantId(grantId);
	}
}
