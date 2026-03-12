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

	getAll(query: QueryCategoryDto): Promise<Category[]> {
		return this.getCategories(query);
	}

	getCategories(query: QueryCategoryDto): Promise<Category[]> {
		return this.categoriesService.getAll(query);
	}

	getById(id: string): Promise<Category> {
		return this.getCategoryById(id);
	}

	getCategoryById(id: string): Promise<Category> {
		return this.categoriesService.getById(id);
	}

	create(dto: CreateCategoryDto): Promise<Category> {
		return this.createCategory(dto);
	}

	createCategory(dto: CreateCategoryDto): Promise<Category> {
		return this.categoriesService.create(dto, this.spaceContext.spaceId!);
	}

	update(id: string, dto: UpdateCategoryDto): Promise<Category> {
		return this.updateCategory(id, dto);
	}

	updateCategory(id: string, dto: UpdateCategoryDto): Promise<Category> {
		return this.categoriesService.update(id, dto);
	}

	delete(id: string): Promise<Category> {
		return this.deleteCategory(id);
	}

	deleteCategory(id: string): Promise<Category> {
		return this.categoriesService.delete(id);
	}
}
