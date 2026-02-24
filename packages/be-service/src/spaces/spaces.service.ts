import { Space } from "@cocrepo/entity";
import type { Prisma } from "@cocrepo/prisma";
import { SpacesRepository } from "@cocrepo/repository";
import { Injectable, Logger } from "@nestjs/common";
import type { CreateSpaceInput } from "./input";

@Injectable()
export class SpacesService {
	private readonly logger = new Logger(SpacesService.name);

	constructor(private readonly repository: SpacesRepository) {}

	/**
	 * ID로 Space 조회
	 */
	getById(id: string): Promise<Space | null> {
		return this.repository.findById(id);
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
	create(input?: CreateSpaceInput): Promise<Space> {
		return this.repository.create(
			input as Prisma.SpaceUncheckedCreateInput | undefined,
		);
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
