import { Module } from '@nestjs/common';
import { CategoriesController } from '@shared/backend';

@Module({
  controllers: [CategoriesController],
})
export class CategoriesModule {}
