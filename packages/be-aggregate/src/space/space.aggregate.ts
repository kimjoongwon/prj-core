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
	createPersonalSpace(name: string): Promise<Space> {
		this.logger.debug(`개인 Space 생성: ${name}`);
		return this.repository.create({ name });
	}

	/**
	 * Space 생성 (옵션 포함)
	 */
	create(data: Prisma.SpaceUncheckedCreateInput): Promise<Space> {
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
			name: input.name,
			label: input.label ?? null,
			contentLanguageCode: input.contentLanguageCode,
		});

		return this.repository.createFitnessCenterBySpaceId(space.seq, {
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

		// 이름/라벨/콘텐츠 언어는 Space 컬럼으로, 시설 속성은 FitnessCenter로 나눠 반영합니다.
		const spaceUpdate: Prisma.SpaceUncheckedUpdateInput = {};
		if (input.contentLanguageCode !== undefined) {
			spaceUpdate.contentLanguageCode = input.contentLanguageCode;
		}
		if (input.name !== undefined) {
			spaceUpdate.name = input.name;
		}
		if (input.label !== undefined) {
			spaceUpdate.label = input.label;
		}
		if (Object.keys(spaceUpdate).length > 0) {
			await this.repository.updateById(spaceId, spaceUpdate);
		}

		const fitnessCenterUpdate = {
			...(input.address !== undefined && { address: input.address }),
			...(input.phone !== undefined && { phone: input.phone }),
			...(input.email !== undefined && { email: input.email }),
			...(input.imageFileId !== undefined && {
				imageFileId: input.imageFileId,
			}),
		};
		if (Object.keys(fitnessCenterUpdate).length === 0) {
			const space = await this.repository.findById(spaceId);
			if (!space) {
				throw new NotFoundException("공간을 찾을 수 없습니다");
			}
			return space;
		}

		return this.repository.updateFitnessCenterBySpaceId(spaceId, {
			fitnessCenter: fitnessCenterUpdate,
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
