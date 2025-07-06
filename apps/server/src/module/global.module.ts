import { Global, Module } from '@nestjs/common';
import {
  AssignmentsService,
  CategoriesService,
  FileClassificationsService,
  GroundsService,
  GroupsService,
  ProgramsService,
  RoleClassificationsService,
  RolesService,
  RoutinesService,
  SessionsService,
  SpaceClassificationsService,
  SpacesService,
  SubjectsService,
  TimelinesService,
  UserClassificationsService,
  UsersService,
} from '../shared/service/services';
import { FilesService } from '../shared/service/files.service';
import { RolesRepository } from '../shared/repository/role.repository';
import { ExercisesService } from '../shared/service/exercises.service';
import { TenantsService } from '../shared/service/tenants.service';
import { repositories } from '@shared';

const modules = [
  ...repositories,
  CategoriesService,
  FilesService,
  GroupsService,
  SpacesService,
  ProgramsService,
  RolesService,
  RolesRepository,
  RoutinesService,
  SessionsService,
  SubjectsService,
  TimelinesService,
  UsersService,
  CategoriesService,
  ExercisesService,
  TenantsService,
  AssignmentsService,
  GroundsService,
  RoleClassificationsService,
  UserClassificationsService,
  SpaceClassificationsService,
  FileClassificationsService,
];
@Global()
@Module({
  providers: modules,
  exports: modules,
})
export class GlobalModule {}
