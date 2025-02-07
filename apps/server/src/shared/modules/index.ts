import { Global, Module } from '@nestjs/common';
import {
  AbilitiesService,
  ActionsService,
  CategoriesService,
  ClassificationsService,
  DepotsService,
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
  CategoriesRepository,
  ClassificationsRepository,
  ExercisesRepository,
  FilesRepository,
  ProgramsRepository,
  RoutinesRepository,
  SessionsRepository,
  SubjectsRepository,
  TimelinesRepository,
  UsersRepository,
} from '../repositories';
import { DepotsRepository } from '../repositories/depots.repository';
import { FilesService } from '../services/files.service';
import { RolesRepository } from '../repositories/role.repository';
import { AwsService } from '../domains/aws/aws.service';
import { ExercisesService } from '../services/exercises.service';
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
];
@Global()
@Module({
  providers: modules,
  exports: modules,
})
export class GlobalModule {}
