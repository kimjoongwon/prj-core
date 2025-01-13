import { Module } from '@nestjs/common';
import { CategoryLogicModule } from '../../modules/category-logic.module';
import { BuilderService } from './builder.service';
import { SpaceNewEditRoute } from './routes/space-new-edit';
import { CategoryRoute } from './routes/category.route';
import { RoleNewEditRoute } from './routes/role-new-edit.route';
import { SpacesRoute } from './routes/spaces.route';

@Module({
  imports: [CategoryLogicModule],
  providers: [BuilderService, SpaceNewEditRoute, CategoryRoute, RoleNewEditRoute, SpacesRoute],
  exports: [BuilderService],
})
export class BuilderModule {}
