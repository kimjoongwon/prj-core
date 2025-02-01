import { Module } from '@nestjs/common';
import { CategoriesController } from '@shared';

@Module({
  controllers: [CategoriesController],
})
export class CategoriesEndpointModule {}
