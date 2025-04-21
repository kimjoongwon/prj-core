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
} from '../services';
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
} from '../repositories';
import { DepotsRepository } from '../repositories/depots.repository';
import { FilesService } from '../services/files.service';
import { RolesRepository } from '../repositories/role.repository';
import { AwsService } from '../domains/aws/aws.service';
import { ExercisesService } from '../services/exercises.service';
import { TenantsService } from '../services/tenants.service';
import { ColumnBuilderService } from '../domains/builder/column/column-builder.service';
import { DataGridBuilderService } from '../domains/builder/data-grid/data-grid-builder.service';
import { FormBuilderService } from '../domains/builder/form/form-builder.service';
import { InputBuilderService } from '../domains/builder/Input/Input-builder.service';
import { ButtonBuilderService } from '../domains/builder/button/button-builder.service';

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
