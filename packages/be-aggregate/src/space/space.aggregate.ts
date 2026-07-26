import { Space } from "@cocrepo/entity";
import type {
	CreateSpaceCommandInput,
	UpdateSpaceFitnessCenterCommandInput,
} from "@cocrepo/input";
import type { LanguageCode, Prisma } from "@cocrepo/prisma";
import { SpacesRepository } from "@cocrepo/repository";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";

@Injectable()
export class SpaceAggregate {
	private readonly logger = new Logger(SpaceAggregate.name);

	constructor(private readonly repository: SpacesRepository) {}

	/**
	 * ID로 Space 조회
	 */
	getById(id: string): Promise<Space | null> {
		return this.repository.findById(id);
	}

	/**
	 * Company/FitnessCenter detail이 있는 Space 목록 조회
	 */
	async listSpaces(params?: {
		spaceIds?: string[];
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
		spaceId: string,
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
	 * 새 Space 생성
	 * 회원가입 시 개인 Space 생성에 사용
	 */
	createPersonalSpace(): Promise<Space> {
		this.logger.debug("개인 Space 생성");
		return this.repository.create();
	}

	/**
	 * Space 생성 (옵션 포함)
	 */
	create(data?: Prisma.SpaceUncheckedCreateInput): Promise<Space> {
		return this.repository.create(data);
	}

	/**
	 * Space + Company/FitnessCenter detail 생성
	 */
	@Transactional()
	async createSpaceWithFitnessCenter(
		input: CreateSpaceCommandInput,
	): Promise<Space> {
		this.logger.debug(`공간 생성: businessNo=${input.businessNo}`);

		const space = await this.repository.create({
			contentLanguageCode: input.contentLanguageCode,
		});

		return this.repository.createFitnessCenterBySpaceId(space.id, {
			company: {
				name: input.name,
				label: input.label ?? null,
				address: input.address,
				phone: input.phone,
				email: input.email,
				businessNo: input.businessNo,
				logoImageFileId: input.logoImageFileId ?? null,
			},
			fitnessCenter: {
				name: input.name,
				label: input.label ?? null,
				address: input.address,
				phone: input.phone,
				email: input.email,
				imageFileId: input.imageFileId ?? null,
			},
		});
	}

	/**
	 * Space의 FitnessCenter detail 수정
	 */
	async updateFitnessCenterBySpaceId(
		spaceId: string,
		input: UpdateSpaceFitnessCenterCommandInput,
	): Promise<Space> {
		await this.getFitnessCenterBySpaceId(spaceId);

		if (input.contentLanguageCode !== undefined) {
			await this.repository.updateById(spaceId, {
				contentLanguageCode: input.contentLanguageCode,
			});
		}

		return this.repository.updateFitnessCenterBySpaceId(spaceId, {
			fitnessCenter: {
				...(input.name !== undefined && { name: input.name }),
				...(input.label !== undefined && { label: input.label }),
				...(input.address !== undefined && { address: input.address }),
				...(input.phone !== undefined && { phone: input.phone }),
				...(input.email !== undefined && { email: input.email }),
				...(input.imageFileId !== undefined && {
					imageFileId: input.imageFileId,
				}),
			},
		});
	}

	/**
	 * SpaceCategory 위계 기반 접근 가능한 Space ID 배열 조회
	 */
	getAccessibleSpaceIds(spaceId: string): Promise<string[]> {
		return this.repository.findSpaceIdsByCategoryHierarchy(spaceId);
	}

	/**
	 * 여러 ID로 Space 조회 (FitnessCenter 포함)
	 */
	findByIdsWithFitnessCenter(ids: string[]): Promise<Space[]> {
		return this.repository.findByIdsWithFitnessCenter(ids);
	}
}
