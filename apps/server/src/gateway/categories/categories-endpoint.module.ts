import { Module } from '@nestjs/common';
import { CategoriesController, CategoryLogicModule } from '@shared';

@Module({
  imports: [CategoryLogicModule],
  controllers: [CategoriesController],
})
export class CategoriesEndpointModule {}
