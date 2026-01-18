import { SYSTEM_ROLES } from "@cocrepo/constant";
import { CreateRoleDto, UpdateRoleDto } from "@cocrepo/dto";
import { Role } from "@cocrepo/prisma";
import { RolesRepository } from "@cocrepo/repository";
import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";

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
		return this.repository.findByName(SYSTEM_ROLES.USER);
	}

	/**
	 * 전체 역할 목록 조회
	 */
	getAll(): Promise<Role[]> {
		return this.repository.findAll();
	}

	/**
	 * 역할 생성
	 * - 이름 중복 불가
	 * - isSystem은 자동으로 false로 설정
	 */
	async create(dto: CreateRoleDto): Promise<Role> {
		this.logger.debug(`역할 생성 시도: name=${dto.name}`);

		// 이름 중복 체크
		const existing = await this.repository.findByName(dto.name);
		if (existing) {
			throw new ConflictException(`이미 존재하는 역할 이름입니다: ${dto.name}`);
		}

		return this.repository.create({
			name: dto.name,
			displayName: dto.displayName,
			description: dto.description,
			isSystem: false, // 사용자 생성 역할은 항상 비시스템
		});
	}

	/**
	 * 역할 수정
	 * - 시스템 역할 수정 불가
	 * - name은 수정 불가 (UpdateRoleDto에서 제외됨)
	 */
	async update(id: string, dto: UpdateRoleDto): Promise<Role> {
		this.logger.debug(`역할 수정 시도: ${id.slice(-8)}`);

		const role = await this.repository.findById(id);
		if (!role) {
			throw new NotFoundException("역할을 찾을 수 없습니다");
		}

		if (role.isSystem) {
			throw new ForbiddenException("시스템 역할은 수정할 수 없습니다");
		}

		return this.repository.updateById(id, {
			displayName: dto.displayName,
			description: dto.description,
		});
	}

	/**
	 * 역할 삭제
	 * - 시스템 역할 삭제 불가
	 * - 연결된 테넌트가 있으면 삭제 불가
	 */
	async delete(id: string): Promise<Role> {
		this.logger.debug(`역할 삭제 시도: ${id.slice(-8)}`);

		const role = await this.repository.findById(id);
		if (!role) {
			throw new NotFoundException("역할을 찾을 수 없습니다");
		}

		if (role.isSystem) {
			throw new ForbiddenException("시스템 역할은 삭제할 수 없습니다");
		}

		// 연결된 테넌트 수 확인
		const tenantCount = await this.repository.countTenantsByRoleId(id);
		if (tenantCount > 0) {
			throw new BadRequestException(
				`이 역할에 ${tenantCount}명의 사용자가 연결되어 있습니다. 먼저 사용자의 역할을 변경해주세요.`,
			);
		}

		return this.repository.deleteById(id);
	}
}
