import { Space } from "@cocrepo/entity";
import type { LanguageCode } from "@cocrepo/prisma";
import { SpacesRepository } from "@cocrepo/repository";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class SpaceAggregate {
	constructor(private readonly repository: SpacesRepository) {}

	/**
	 * ID로 Space 조회
	 */
	getById(id: bigint): Promise<Space | null> {
		return this.repository.findById(id);
	}

	/**
	 * Company/FitnessCenter detail이 있는 Space 목록 조회
	 */
	async listSpaces(params?: {
		spaceIds?: bigint[];
		skip?: number;
		take?: number;
		search?: string;
		contentLanguageCode?: LanguageCode;
	}): Promise<{ spaces: Space[]; total: number }> {
		const [spaces, total] =
			await this.repository.findManyWithFitnessCenter(params);
		return { spaces, total };
	}

	/**
	 * Space의 FitnessCenter detail 조회
	 */
	async getFitnessCenterBySpaceId(
		spaceId: bigint,
	): Promise<
		NonNullable<
			Awaited<ReturnType<SpacesRepository["findFitnessCenterBySpaceId"]>>
		>
	> {
		const fitnessCenter =
			await this.repository.findFitnessCenterBySpaceId(spaceId);
		if (!fitnessCenter) {
			throw new NotFoundException("시설 정보를 찾을 수 없습니다");
		}

		return fitnessCenter;
	}

	/**
	 * 여러 ID로 Space 조회 (FitnessCenter 포함)
	 */
	findByIdsWithFitnessCenter(ids: bigint[]): Promise<Space[]> {
		return this.repository.findByIdsWithFitnessCenter(ids);
	}
}
