import { Role, Roles } from "@cocrepo/prisma";
import { RolesRepository } from "@cocrepo/repository";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class RolesService {
	private readonly logger = new Logger(RolesService.name);

	constructor(private readonly repository: RolesRepository) {}

	/**
	 * ID로 역할 조회
	 */
	getById(id: string): Promise<Role | null> {
		return this.repository.findById(id);
	}

	/**
	 * 기본 사용자 역할 조회
	 * 회원가입 시 사용
	 */
	getDefaultUserRole(): Promise<Role | null> {
		this.logger.debug("기본 사용자 역할(USER) 조회");
		return this.repository.findByName(Roles.USER);
	}

	/**
	 * 전체 역할 목록 조회
	 */
	getAll(): Promise<Role[]> {
		return this.repository.findAll();
	}
}
