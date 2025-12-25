import { CategoriesRepository } from "@cocrepo/repository";
import { CategoriesService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { CategoriesController } from "@shared";

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule {}
