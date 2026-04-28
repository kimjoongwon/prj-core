import { Ground, Space } from "@cocrepo/entity";
import type { CreateGroundDto, UpdateGroundDto } from "@cocrepo/dto";
import type { Prisma } from "@cocrepo/prisma";
import { SpacesRepository } from "@cocrepo/repository";
import {
	ConflictException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";

@Injectable()
export class SpaceService {
	private readonly logger = new Logger(SpaceService.name);

	constructor(private readonly repository: SpacesRepository) {}

	/**
	 * ID로 Space 조회
	 */
	getById(id: string): Promise<Space | null> {
		return this.repository.findById(id);
	}

	/**
	 * Ground detail이 있는 Space 목록 조회
	 */
	async listSpaces(params?: {
		spaceIds?: string[];
		skip?: number;
		take?: number;
		search?: string;
	}): Promise<{ spaces: Space[]; total: number }> {
		const [spaces, total] = await this.repository.findManyWithGround(params);
		return { spaces, total };
	}

	/**
	 * Space의 Ground detail 조회
	 */
	async getGroundBySpaceId(spaceId: string): Promise<Ground> {
		const ground = await this.repository.findGroundBySpaceId(spaceId);
		if (!ground) {
			throw new NotFoundException("시설 정보를 찾을 수 없습니다");
		}

		return ground;
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
	 * Space + Ground detail 생성
	 */
	@Transactional()
	async createSpaceWithGround(dto: CreateGroundDto): Promise<Space> {
		this.logger.debug(`공간 생성: businessNo=${dto.businessNo}`);

		const existing = await this.repository.findGroundByBusinessNo(
			dto.businessNo,
		);
		if (existing) {
			throw new ConflictException(
				`이미 등록된 사업자등록번호입니다: ${dto.businessNo}`,
			);
		}

		const space = await this.repository.create();

		return this.repository.createGroundBySpaceId(space.id, {
			name: dto.name,
			label: dto.label ?? null,
			address: dto.address,
			phone: dto.phone,
			email: dto.email,
			businessNo: dto.businessNo,
			logoImageFileId: dto.logoImageFileId ?? null,
			imageFileId: dto.imageFileId ?? null,
		});
	}

	/**
	 * Space의 Ground detail 수정
	 */
	async updateGroundBySpaceId(
		spaceId: string,
		dto: UpdateGroundDto,
	): Promise<Space> {
		await this.getGroundBySpaceId(spaceId);

		return this.repository.updateGroundBySpaceId(spaceId, {
			...(dto.name !== undefined && { name: dto.name }),
			...(dto.label !== undefined && { label: dto.label }),
			...(dto.address !== undefined && { address: dto.address }),
			...(dto.phone !== undefined && { phone: dto.phone }),
			...(dto.email !== undefined && { email: dto.email }),
			...(dto.logoImageFileId !== undefined && {
				logoImageFileId: dto.logoImageFileId,
			}),
			...(dto.imageFileId !== undefined && {
				imageFileId: dto.imageFileId,
			}),
		});
	}

	/**
	 * SpaceCategory 위계 기반 접근 가능한 Space ID 배열 조회
	 */
	getAccessibleSpaceIds(spaceId: string): Promise<string[]> {
		return this.repository.findSpaceIdsByCategoryHierarchy(spaceId);
	}

	/**
	 * 여러 ID로 Space 조회 (Ground 포함)
	 */
	findByIdsWithGround(ids: string[]): Promise<Space[]> {
		return this.repository.findByIdsWithGround(ids);
	}

	/**
	 * Space 삭제 (Soft Delete)
	 */
	removeById(id: string): Promise<Space> {
		return this.repository.removeById(id);
	}
}
