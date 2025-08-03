import { Module } from "@nestjs/common";
import {
	CategoriesController,
	CategoriesRepository,
	CategoriesService,
} from "@shared";

@Module({
	controllers: [CategoriesController],
	providers: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule {}
