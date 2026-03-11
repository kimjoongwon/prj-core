import {
	CreateCategoryDto,
	QueryCategoryDto,
	UpdateCategoryDto,
} from "@cocrepo/dto";
import { Category } from "@cocrepo/entity";
import { CategoriesService, SpaceContext } from "@cocrepo/service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CategoriesApplicationService {
	constructor(
		private readonly categoriesService: CategoriesService,
		private readonly spaceContext: SpaceContext,
	) {}

	getCategories(query: QueryCategoryDto): Promise<Category[]> {
		return this.categoriesService.getAll(query);
	}

	getCategoryById(id: string): Promise<Category> {
		return this.categoriesService.getById(id);
	}

	createCategory(dto: CreateCategoryDto): Promise<Category> {
		return this.categoriesService.create(dto, this.spaceContext.spaceId!);
	}

	updateCategory(id: string, dto: UpdateCategoryDto): Promise<Category> {
		return this.categoriesService.update(id, dto);
	}

	deleteCategory(id: string): Promise<Category> {
		return this.categoriesService.delete(id);
	}
}
