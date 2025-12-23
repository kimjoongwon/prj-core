import { ApiResponseEntity } from "@cocrepo/decorator";
import {
	CategoryDto,
	CreateCategoryDto,
	QueryCategoryDto,
	UpdateCategoryDto,
} from "@cocrepo/dto";
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ResponseMessage } from "../../decorator/response-message.decorator";
import { CategoriesService } from "../../service";
import { wrapResponse } from "../../util/response.util";

@ApiTags("CATEGORIES")
@Controller()
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) {}

	@ApiResponseEntity(CategoryDto, HttpStatus.OK, { isArray: true })
	@Get()
	@ResponseMessage("Successfully fetched categories")
	async getCategoriesByQuery(@Query() query: QueryCategoryDto) {
		const { categories, count } =
			await this.categoriesService.getManyByQuery(query);
		return wrapResponse(categories, {
			message: "Successfully fetched categories",
			meta: query.toPageMetaDto(count),
		});
	}

	@ApiResponseEntity(CategoryDto)
	@Post()
	@ResponseMessage("Category created")
	async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
		const category = await this.categoriesService.create({
			data: createCategoryDto,
		});
		return category;
	}

	@ApiResponseEntity(CategoryDto)
	@Get(":categoryId")
	@ResponseMessage("Category found")
	async getCategoryById(@Param("categoryId") categoryId: string) {
		const category = await this.categoriesService.getById(categoryId);

		return category;
	}

	@ApiResponseEntity(CategoryDto)
	@Patch(":categoryId")
	@ResponseMessage("Category updated")
	async updateCategoryById(
		@Param("categoryId") id: string,
		@Body() updateCategoryDto: UpdateCategoryDto,
	) {
		const category = await this.categoriesService.updateById(
			id,
			updateCategoryDto,
		);
		return category;
	}

	@ApiResponseEntity(CategoryDto)
	@Delete(":categoryId")
	@ResponseMessage("Category deleted")
	async deleteCategoryById(@Param("categoryId") id: string) {
		await this.categoriesService.deleteById(id);
		return;
	}
}
