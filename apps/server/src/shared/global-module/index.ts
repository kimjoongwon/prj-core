import { Global, Module } from '@nestjs/common';
import {
  AbilitiesService,
  ActionsService,
  AssignmentsService,
  CategoriesService,
  ClassificationsService,
  DepotsService,
  GroundsService,
  ProgramsService,
  RolesService,
  RoutinesService,
  SessionsService,
  SubjectsService,
  TimelinesService,
  UsersService,
} from '../service';
import {
  AbilitiesRepository,
  ActionsRepository,
  AssignmentsRepository,
  CategoriesRepository,
  ClassificationsRepository,
  ExercisesRepository,
  FilesRepository,
  GroundsRepository,
  ProgramsRepository,
  RoutinesRepository,
  SessionsRepository,
  SubjectsRepository,
  TenantsRepository,
  TimelinesRepository,
  UsersRepository,
} from '../repository';
import { DepotsRepository } from '../repository/depots.repository';
import { FilesService } from '../service/files.service';
import { RolesRepository } from '../repository/role.repository';
import { AwsService } from '../domain/aws/aws.service';
import { ExercisesService } from '../service/exercises.service';
import { TenantsService } from '../service/tenants.service';
import { ColumnBuilderService } from '../domain/builder/column/column-builder.service';
import { DataGridBuilderService } from '../domain/builder/data-grid/data-grid-builder.service';
import { FormBuilderService } from '../domain/builder/form/form-builder.service';
import { InputBuilderService } from '../domain/builder/Input/Input-builder.service';
import { ButtonBuilderService } from '../domain/builder/button/button-builder.service';

const modules = [
  AbilitiesService,
  AbilitiesRepository,
  ActionsService,
  ActionsRepository,
  CategoriesService,
  CategoriesRepository,
  DepotsService,
  DepotsRepository,
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
  ClassificationsService,
  ClassificationsRepository,
  AwsService,
  ExercisesService,
  ExercisesRepository,
  DepotsService,
  DepotsRepository,
  TenantsService,
  TenantsRepository,
  AssignmentsService,
  AssignmentsRepository,
  InputBuilderService,
  ColumnBuilderService,
  DataGridBuilderService,
  FormBuilderService,
  ButtonBuilderService,
  GroundsService,
  GroundsRepository,
];
@Global()
@Module({
  providers: modules,
  exports: modules,
})
export class GlobalModule {}
