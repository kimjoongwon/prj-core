import { Module } from '@nestjs/common';
import {
  AdminMainRouteController,
  CategoriesRouteModule,
  CategoryEditRouteModule,
  CategoryRouteModule,
  GroupEditRouteModule,
  GroupsRouteModule,
  SessionEditRouteModule,
  SessionsRouteModule,
  TenanciesRouteModule,
  TimelineEditRouteModule,
  TimelinesRouteModule,
  RoutinesRouteModule,
  RoutineEditRouteModule,
} from '@shared';

@Module({
  imports: [
    CategoriesRouteModule,
    TenanciesRouteModule,
    CategoryEditRouteModule,
    CategoryRouteModule,
    GroupsRouteModule,
    GroupEditRouteModule,
    TimelinesRouteModule,
    TimelineEditRouteModule,
    SessionsRouteModule,
    SessionEditRouteModule,
    RoutinesRouteModule,
    RoutineEditRouteModule,
  ],
  controllers: [AdminMainRouteController],
})
export class AdminMainRouteEndpointModule {}
