import { AssignmentsRepository } from './assignments.repository';
import { CategoriesRepository } from './categories.repository';
import { ExercisesRepository } from './exercises.repository';
import { FileAssociationsRepository } from './file-associations.repository';
import { FileClassificationsRepository } from './file-classifications.repository';
import { FilesRepository } from './files.repository';
import { GroundsRepository } from './grounds.repository';
import { GroupsRepository } from './groups.repository';
import { ProgramsRepository } from './programs.repository';
import { RoleAssociationsRepository } from './role-associations.repository';
import { RoleClassificationsRepository } from './role-classifications.repository';
import { RolesRepository } from './role.repository';
import { RoutinesRepository } from './routines.repository';
import { SessionsRepository } from './sessions.repository';
import { SpaceAssociationsRepository } from './space-associations.repository';
import { SpaceClassificationsRepository } from './space-classifications.repository';
import { SpacesRepository } from './spaces.repository';
import { SubjectsRepository } from './subjects.repository';
import { TasksRepository } from './tasks.repository';
import { TenantsRepository } from './tenants.repository';
import { TimelinesRepository } from './timeline.repository';
import { UserAssociationsRepository } from './user-associations.repository';
import { UserClassificationsRepository } from './user-classifications.repository';
import { UsersRepository } from './users.repository';

export * from './assignments.repository';
export * from './categories.repository';
export * from './exercises.repository';
export * from './file-associations.repository';
export * from './file-classifications.repository';
export * from './files.repository';
export * from './grounds.repository';
export * from './groups.repository';
export * from './programs.repository';
export * from './role.repository';
export * from './role-associations.repository';
export * from './role-classifications.repository';
export * from './routines.repository';
export * from './sessions.repository';
export * from './space-associations.repository';
export * from './space-classifications.repository';
export * from './spaces.repository';
export * from './subjects.repository';
export * from './tasks.repository';
export * from './tenants.repository';
export * from './timeline.repository';
export * from './user-associations.repository';
export * from './user-classifications.repository';
export * from './users.repository';

export const repositories = [
  AssignmentsRepository,
  CategoriesRepository,
  ExercisesRepository,
  FileAssociationsRepository,
  FileClassificationsRepository,
  FilesRepository,
  GroundsRepository,
  GroupsRepository,
  ProgramsRepository,
  RoleAssociationsRepository,
  RoleClassificationsRepository,
  RolesRepository,
  RoutinesRepository,
  SessionsRepository,
  SpaceAssociationsRepository,
  SpaceClassificationsRepository,
  SpacesRepository,
  SubjectsRepository,
  TasksRepository,
  TenantsRepository,
  TimelinesRepository,
  UserAssociationsRepository,
  UserClassificationsRepository,
  UsersRepository,
];
