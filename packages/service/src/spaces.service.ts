import { SpacesRepository } from "@cocrepo/repository";
import { Prisma, Space } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";

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
	create(data?: Prisma.SpaceUncheckedCreateInput): Promise<Space> {
		return this.repository.create(data);
	}

	/**
	 * Space 삭제 (Soft Delete)
	 */
	removeById(id: string): Promise<Space> {
		return this.repository.removeById(id);
	}
}
