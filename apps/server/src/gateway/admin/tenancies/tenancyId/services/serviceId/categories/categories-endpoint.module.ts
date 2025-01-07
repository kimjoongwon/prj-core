import { Module } from '@nestjs/common';
import { CategoriesController, CategoriesRepository, CategoriesService } from '@shared';

@Module({
  providers: [CategoriesService, CategoriesRepository],
  controllers: [CategoriesController],
})
export class CategoriesEndpointModule {}
