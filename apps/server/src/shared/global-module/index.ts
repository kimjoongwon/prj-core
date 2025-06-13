import { Global, Module } from '@nestjs/common';
import {
  AbilitiesService,
  ActionsService,
  AssignmentsService,
  CategoriesService,
  FileClassificationsService,
  GroundsService,
  ProgramsService,
  RoleClassificationsService,
  RolesService,
  RoutinesService,
  SessionsService,
  SpaceClassificationsService,
  SubjectsService,
  TimelinesService,
  UserClassificationsService,
  UsersService,
} from '../service';
import {
  AbilitiesRepository,
  ActionsRepository,
  AssignmentsRepository,
  CategoriesRepository,
  ExercisesRepository,
  FileClassificationsRepository,
  FilesRepository,
  GroundsRepository,
  ProgramsRepository,
  RoleClassificationsRepository,
  RoutinesRepository,
  SessionsRepository,
  SpaceClassificationsRepository,
  SubjectsRepository,
  TenantsRepository,
  TimelinesRepository,
  UserClassificationsRepository,
  UsersRepository,
} from '../repository';
import { FilesService } from '../service/files.service';
import { RolesRepository } from '../repository/role.repository';
import { AwsService } from '../domain/aws/aws.service';
import { ExercisesService } from '../service/exercises.service';
import { TenantsService } from '../service/tenants.service';
import { DataGridBuilderService } from '../../modules/app-builder/components/data-grid/data-grid-builder.service';
import { ElementBuilderService } from '../../modules/app-builder/components/Input/Input-builder.service';
import { ResourceConfigService } from '../../modules/app-builder/components/services/resource-config.service';

const modules = [
  AbilitiesService,
  AbilitiesRepository,
  ActionsService,
  ActionsRepository,
  CategoriesService,
  CategoriesRepository,
  FilesService,
  FilesRepository,
  ProgramsService,
  ProgramsRepository,
  RolesService,
  RolesRepository,
  RoutinesService,
  RoutinesRepository,
  SessionsService,
  SessionsRepository,
  SubjectsService,
  SubjectsRepository,
  TimelinesService,
  TimelinesRepository,
  UsersService,
  UsersRepository,
  CategoriesService,
  CategoriesRepository,
  AwsService,
  ExercisesService,
  ExercisesRepository,
  TenantsService,
  TenantsRepository,
  AssignmentsService,
  AssignmentsRepository,
  ElementBuilderService,
  DataGridBuilderService,
  GroundsService,
  GroundsRepository,
  ResourceConfigService,
  RoleClassificationsRepository,
  RoleClassificationsService,
  UserClassificationsRepository,
  UserClassificationsService,
  SpaceClassificationsRepository,
  SpaceClassificationsService,
  FileClassificationsRepository,
  FileClassificationsService,
];
@Global()
@Module({
  providers: modules,
  exports: modules,
})
export class GlobalModule {}
