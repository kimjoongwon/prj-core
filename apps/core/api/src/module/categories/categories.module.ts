import { CategoriesApplicationService } from "@cocrepo/app";
import { CategoriesRepository } from "@cocrepo/repository";
import { CategoriesService, SpaceContext } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { CategoriesController } from "./categories.controller";

@Module({
	controllers: [CategoriesController],
	providers: [
		CategoriesApplicationService,
		CategoriesService,
		CategoriesRepository,
		SpaceContext,
	],
	exports: [CategoriesApplicationService],
})
export class CategoriesModule {}
