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
import { ColumnBuilderService } from '../../modules/builder/builder/column/column-builder.service';
import { DataGridBuilderService } from '../../modules/builder/builder/data-grid/data-grid-builder.service';
import { FormBuilderService } from '../../modules/builder/builder/form/form-builder.service';
import { InputBuilderService } from '../../modules/builder/builder/Input/Input-builder.service';
import { ButtonBuilderService } from '../../modules/builder/builder/button/button-builder.service';

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
