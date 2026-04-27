import { CreateGroupDto, QueryGroupDto, UpdateGroupDto } from "@cocrepo/dto";
import { Group } from "@cocrepo/entity";
import type { Prisma } from "@cocrepo/prisma";
import { GroupTypes } from "@cocrepo/prisma";
import { GroupsRepository } from "@cocrepo/repository";
import {
	ConflictException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";

@Injectable()
export class GroupService {
	private readonly logger = new Logger(GroupService.name);

	constructor(private readonly repository: GroupsRepository) {}

	/**
	 * 그룹 목록 조회
	 */
	async getAll(query: QueryGroupDto, spaceIds?: string[]): Promise<Group[]> {
		const where = this.applySpaceScope(query.toPrismaWhere(), spaceIds);
		const orderBy = query.toPrismaOrderBy();

		return this.repository.findMany({ where, orderBy });
	}

	/**
	 * ID로 그룹 조회 (연결된 역할 포함)
	 */
	async getById(id: string, spaceIds?: string[]): Promise<Group> {
		const group = await this.repository.findById(id, {
			roleAssociations: {
				include: { role: true },
			},
		});

		if (!group) {
			throw new NotFoundException("그룹을 찾을 수 없습니다");
		}

		if (spaceIds !== undefined && !spaceIds.includes(group.spaceId)) {
			throw new NotFoundException("그룹을 찾을 수 없습니다");
		}

		return group;
	}

	private applySpaceScope(
		where: Prisma.GroupWhereInput,
		spaceIds?: string[],
	): Prisma.GroupWhereInput {
		if (spaceIds === undefined) {
			return where;
		}

		return {
			...where,
			spaceId: { in: spaceIds },
		};
	}

	/**
	 * 그룹 생성
	 * - 같은 spaceId + type 내 name 중복 불가
	 */
	async create(dto: CreateGroupDto, spaceId: string): Promise<Group> {
		this.logger.debug(`그룹 생성 시도: name=${dto.name}`);

		// 중복 체크 (같은 Space + type 내)
		const existing = await this.repository.findMany({
			where: {
				name: dto.name,
				type: dto.type ?? GroupTypes.Role,
				spaceId,
			},
		});

		if (existing.length > 0) {
			throw new ConflictException(`이미 존재하는 그룹 이름입니다: ${dto.name}`);
		}

		return this.repository.create({
			name: dto.name,
			label: dto.label,
			type: dto.type ?? GroupTypes.Role,
			spaceId,
			creatorId: dto.creatorId,
		});
	}

	/**
	 * 그룹 수정
	 */
	async update(id: string, dto: UpdateGroupDto): Promise<Group> {
		this.logger.debug(`그룹 수정 시도: ${id.slice(-8)}`);

		const group = await this.repository.findById(id);
		if (!group) {
			throw new NotFoundException("그룹을 찾을 수 없습니다");
		}

		return this.repository.updateById(id, {
			...(dto.label !== undefined && { label: dto.label }),
			...(dto.name !== undefined && { name: dto.name }),
		});
	}

	/**
	 * 그룹 삭제
	 * - 연결된 역할이 있어도 삭제 허용 (RoleAssociation cascade)
	 */
	async delete(id: string): Promise<Group> {
		this.logger.debug(`그룹 삭제 시도: ${id.slice(-8)}`);

		const group = await this.repository.findById(id);
		if (!group) {
			throw new NotFoundException("그룹을 찾을 수 없습니다");
		}

		return this.repository.deleteById(id);
	}
}
