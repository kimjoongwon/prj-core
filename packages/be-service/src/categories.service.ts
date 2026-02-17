import {
	CreateCategoryDto,
	QueryCategoryDto,
	UpdateCategoryDto,
} from "@cocrepo/dto";
import { Category } from "@cocrepo/entity";
import { CategoryTypes } from "@cocrepo/prisma";
import { CategoriesRepository } from "@cocrepo/repository";
import {
	BadRequestException,
	ConflictException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";

@Injectable()
export class CategoriesService {
	private readonly logger = new Logger(CategoriesService.name);

	constructor(private readonly repository: CategoriesRepository) {}

	/**
	 * 카테고리 목록 조회
	 */
	async getAll(query: QueryCategoryDto): Promise<Category[]> {
		const where = query.toPrismaWhere();
		const orderBy = query.toPrismaOrderBy();

		return this.repository.findMany({
			where,
			orderBy,
			include: { parent: true, children: true },
		});
	}

	/**
	 * ID로 카테고리 조회 (상위, 하위, 연결된 역할 포함)
	 */
	async getById(id: string): Promise<Category> {
		const category = await this.repository.findById(id, {
			parent: true,
			children: true,
			roleClassifications: {
				include: { role: true },
			},
		});

		if (!category) {
			throw new NotFoundException("카테고리를 찾을 수 없습니다");
		}

		return category;
	}

	/**
	 * 카테고리 생성
	 * - name 전역 unique 제약
	 * - parentId가 있으면 존재 여부 확인
	 */
	async create(dto: CreateCategoryDto, spaceId: string): Promise<Category> {
		this.logger.debug(`카테고리 생성 시도: name=${dto.name}`);

		// name 중복 체크 (Category.name은 전역 unique)
		const existing = await this.repository.findByName(dto.name);
		if (existing) {
			throw new ConflictException(
				`이미 존재하는 카테고리 이름입니다: ${dto.name}`,
			);
		}

		// parentId 존재 확인
		if (dto.parentId) {
			const parent = await this.repository.findById(dto.parentId);
			if (!parent) {
				throw new NotFoundException("상위 카테고리를 찾을 수 없습니다");
			}
		}

		return this.repository.create({
			name: dto.name,
			type: dto.type ?? CategoryTypes.Role,
			parentId: dto.parentId,
			spaceId,
			creatorId: dto.creatorId,
		});
	}

	/**
	 * 카테고리 수정
	 * - parentId 변경 시 순환 참조 검증
	 */
	async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
		this.logger.debug(`카테고리 수정 시도: ${id.slice(-8)}`);

		const category = await this.repository.findById(id);
		if (!category) {
			throw new NotFoundException("카테고리를 찾을 수 없습니다");
		}

		// parentId 변경 시 순환 참조 검증
		if (dto.parentId !== undefined && dto.parentId !== category.parentId) {
			await this.validateNoCircularReference(id, dto.parentId);
		}

		return this.repository.updateById(id, {
			...(dto.name !== undefined && { name: dto.name }),
			...(dto.parentId !== undefined && { parentId: dto.parentId }),
		});
	}

	/**
	 * 카테고리 삭제
	 * - 하위 카테고리가 있으면 삭제 거부
	 */
	async delete(id: string): Promise<Category> {
		this.logger.debug(`카테고리 삭제 시도: ${id.slice(-8)}`);

		const category = await this.repository.findById(id);
		if (!category) {
			throw new NotFoundException("카테고리를 찾을 수 없습니다");
		}

		// 하위 카테고리 존재 확인
		const childCount = await this.repository.countChildrenById(id);
		if (childCount > 0) {
			throw new BadRequestException(
				`하위 카테고리가 ${childCount}개 있어 삭제할 수 없습니다. 하위 카테고리를 먼저 삭제해주세요.`,
			);
		}

		return this.repository.deleteById(id);
	}

	/**
	 * 순환 참조 검증
	 * - 자기 자신을 부모로 설정 불가
	 * - 자신의 하위 카테고리를 부모로 설정 불가
	 */
	private async validateNoCircularReference(
		categoryId: string,
		newParentId: string | null,
	): Promise<void> {
		if (!newParentId) return;

		// 자기 자신을 부모로 설정 불가
		if (categoryId === newParentId) {
			throw new BadRequestException(
				"자기 자신을 상위 카테고리로 설정할 수 없습니다",
			);
		}

		// 새 부모가 존재하는지 확인
		const parent = await this.repository.findById(newParentId);
		if (!parent) {
			throw new NotFoundException("상위 카테고리를 찾을 수 없습니다");
		}

		// 자신의 하위 카테고리를 부모로 설정 불가
		const descendantIds =
			await this.repository.findAllDescendantIds(categoryId);
		if (descendantIds.includes(newParentId)) {
			throw new BadRequestException(
				"하위 카테고리를 상위 카테고리로 설정할 수 없습니다 (순환 참조)",
			);
		}
	}
}
