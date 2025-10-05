import { Module } from "@nestjs/common";
import {
	CategoriesController,
	CategoriesRepository,
	CategoriesService,
	ContextService,
} from "@shared";

@Module({
	controllers: [CategoriesController],
	providers: [CategoriesService, CategoriesRepository, ContextService],
})
export class CategoriesModule {}
