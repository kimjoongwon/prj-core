import { CategoriesRepository } from "@cocrepo/repository";
import { CategoriesService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { CategoriesController } from "./categories.controller";

@Module({
	controllers: [CategoriesController],
	providers: [CategoriesService, CategoriesRepository],
	exports: [CategoriesService],
})
export class CategoriesModule {}
