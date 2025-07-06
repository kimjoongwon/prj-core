import { Global, Module } from '@nestjs/common';
import {
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
import { AwsService } from '../../modules/auth/aws.service';
import { ExercisesService } from '../service/exercises.service';
import { TenantsService } from '../service/tenants.service';
import { PrismaService } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

const modules = [
  PrismaService,
  JwtService,
  ConfigService,
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
  // ElementBuilderService,
  GroundsService,
  GroundsRepository,
  // ResourceConfigService,
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
