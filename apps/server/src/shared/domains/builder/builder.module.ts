import { Module } from '@nestjs/common';
import { CategoryLogicModule } from '../../modules/category-logic.module';
import { BuilderService } from './app-builder.service';
import { SpaceNewEditRoute } from './routes/space-new-edit';
import { CategoryRoute } from './routes/category.route';
import { RoleNewEditRoute } from './routes/role-new-edit.route';
import { SpacesRoute } from './routes/spaces.route';
import { ActionNewEditRoute } from './routes/action-new-edit.route';
import { AbilitiesRoute } from './routes/abilities.route';
import { AbilityNewEditRoute } from './routes/ability-new-edit.route';
import { SessionNewEdit } from './routes/session/session-new-edit.route';
import { TimelinesRoute } from './routes/timeline/timelines.route';
import { TimelineNewEdit } from './routes/timeline/timeline-new-edit.route';
import { RoutinesBuilder } from './routes/routines.route';

@Module({
  imports: [CategoryLogicModule],
  providers: [
    BuilderService,
    SpaceNewEditRoute,
    CategoryRoute,
    RoleNewEditRoute,
    SpacesRoute,
    ActionNewEditRoute,
    AbilitiesRoute,
    AbilityNewEditRoute,
    SessionNewEdit,
    TimelinesRoute,
    TimelineNewEdit,
    RoutinesBuilder,
  ],
  exports: [BuilderService],
})
export class BuilderModule {}
