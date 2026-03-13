import { CategoryFacade } from "@cocrepo/facade";
import { CategoriesRepository } from "@cocrepo/repository";
import { CategoryService, SpaceContext } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { CategoriesController } from "./categories.controller";

@Module({
	controllers: [CategoriesController],
	providers: [
		CategoryFacade,
		CategoryService,
		CategoriesRepository,
		SpaceContext,
	],
	exports: [CategoryFacade],
})
export class CategoriesModule {}
