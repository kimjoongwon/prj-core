import { Module } from '@nestjs/common';
import {
  AdminMainRouteController,
  CategoriesRouteModule,
  CategoryEditRouteModule,
  CategoryRouteModule,
  GroupEditRouteModule,
  GroupsRouteModule,
  TenanciesRouteModule,
} from '@shared';

@Module({
  imports: [
    CategoriesRouteModule,
    TenanciesRouteModule,
    CategoryEditRouteModule,
    CategoryRouteModule,
    GroupsRouteModule,
    GroupEditRouteModule,
  ],
  controllers: [AdminMainRouteController],
})
export class AdminMainRouteEndpointModule {}
