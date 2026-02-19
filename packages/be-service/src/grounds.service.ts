import { CreateGroundDto, UpdateGroundDto } from "@cocrepo/dto";
import { Ground } from "@cocrepo/entity";
import { GroundsRepository } from "@cocrepo/repository";
import {
	ConflictException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";
import { SpacesService } from "./spaces.service";

@Injectable()
export class GroundsService {
	private readonly logger = new Logger(GroundsService.name);

	constructor(
		private readonly repository: GroundsRepository,
		private readonly spacesService: SpacesService,
	) {}

	/**
	 * 모든 Ground 목록 조회
	 */
	getAll(): Promise<Ground[]> {
		return this.repository.findAll();
	}

	/**
	 * 시설 상세 조회
	 * Ground가 없으면 NotFoundException을 던집니다.
	 */
	async getById(id: string): Promise<Ground> {
		this.logger.debug(`시설 상세 조회: ${id.slice(-8)}`);

		const ground = await this.repository.findById(id);
		if (!ground) {
			throw new NotFoundException("시설을 찾을 수 없습니다.");
		}

		return ground;
	}

	/**
	 * 내 Space의 Ground 목록 조회
	 * spaceId가 undefined이면 전체 목록 반환 (FULL_ACCESS 전용)
	 */
	getMyGrounds(spaceId: string | undefined): Promise<Ground[]> {
		if (!spaceId) {
			return this.repository.findAll();
		}
		return this.repository.findManyBySpaceId(spaceId);
	}

	/**
	 * 시설 등록 (Space 자동 생성)
	 * - 사업자등록번호 중복 검증
	 * - Space를 먼저 생성한 뒤 Ground에 spaceId 연결
	 */
	@Transactional()
	async createGround(dto: CreateGroundDto): Promise<Ground> {
		this.logger.debug(`시설 등록 시도: businessNo=${dto.businessNo}`);

		// 사업자등록번호 중복 검증
		const existing = await this.repository.findByBusinessNo(dto.businessNo);
		if (existing) {
			throw new ConflictException(
				`이미 등록된 사업자등록번호입니다: ${dto.businessNo}`,
			);
		}

		// Space 자동 생성
		const space = await this.spacesService.create();
		this.logger.debug(`시설용 Space 생성 완료: ${space.id.slice(-8)}`);

		// Ground 생성 (spaceId 연결)
		return this.repository.create({
			name: dto.name,
			label: dto.label ?? null,
			address: dto.address,
			phone: dto.phone,
			email: dto.email,
			businessNo: dto.businessNo,
			logoImageFileId: dto.logoImageFileId ?? null,
			imageFileId: dto.imageFileId ?? null,
			spaceId: space.id,
		});
	}

	/**
	 * 시설 정보 수정
	 * - businessNo는 변경 불가 (서비스 레이어에서 제외 처리)
	 * - Ground가 없으면 NotFoundException을 던집니다.
	 */
	async updateGround(id: string, dto: UpdateGroundDto): Promise<Ground> {
		this.logger.debug(`시설 수정 시도: ${id.slice(-8)}`);

		const ground = await this.repository.findById(id);
		if (!ground) {
			throw new NotFoundException("시설을 찾을 수 없습니다.");
		}

		// businessNo는 변경 불가 - 명시적으로 제외하고 나머지 필드만 업데이트
		return this.repository.updateById(id, {
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
	 * 시설 소프트 삭제
	 * - Ground가 없으면 NotFoundException을 던집니다.
	 */
	async removeGround(id: string): Promise<void> {
		this.logger.debug(`시설 삭제 시도: ${id.slice(-8)}`);

		const ground = await this.repository.findById(id);
		if (!ground) {
			throw new NotFoundException("시설을 찾을 수 없습니다.");
		}

		await this.repository.removeById(id);
	}
}
