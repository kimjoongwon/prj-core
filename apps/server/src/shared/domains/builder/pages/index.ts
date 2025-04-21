import { Global, Module } from '@nestjs/common';
import { AbilitiesPage } from './abilities.page';
import { AbilityEditPage } from './ability-edit.page';
import { ActionEditPage } from './action-edit.page';
import { ActionsPage } from './actions.page';
import { CategoriesPage } from './categories.page';
import { GroupsPage } from './groups.page';
import { LoginPage } from './login.page';
import { RoleEditPage } from './role-edit.page';
import { RolesPage } from './roles.page';
import { RoutineEditPage } from './routine-edit.page';
import { RoutinesPage } from './routines.page';
import { SessionEditPage } from './session-edit.page';
import { SessionsPage } from './sessions.page';
import { SpaceEditPage } from './space-edit.page';
import { SpacesPage } from './spaces.page';
import { TenantsPage } from './tenants.page';
import { TimelineEditPage } from './timeline-edit.page';
import { TimelinesPage } from './timelines.page';
import { UsersPage } from './users.page';
import { TasksPage } from './tasks.page';
import { TaskEditPage } from './task-edit.page';
import { ExercisesPage } from './exercises.page';
import { ExerciseEditPage } from './exercise-edit.page';
import { GroupPage } from './group.page';
import { CategoryPage } from './category.page';
import { GroundsPage } from './grounds.page';
import { GroundPage } from './ground.page';
const modules = [
  AbilitiesPage,
  AbilityEditPage,
  ActionEditPage,
  ActionsPage,
  CategoriesPage,
  CategoryPage,
  GroupPage,
  GroupsPage,
  LoginPage,
  RoleEditPage,
  RolesPage,
  RoutineEditPage,
  RoutinesPage,
  SessionEditPage,
  SessionsPage,
  SpaceEditPage,
  SpacesPage,
  TenantsPage,
  TimelineEditPage,
  TimelinesPage,
  UsersPage,
  TasksPage,
  TaskEditPage,
  ExercisesPage,
  ExerciseEditPage,
  GroundsPage,
  GroundPage,
];
@Global()
@Module({
  providers: modules,
  exports: modules,
})
export class PagesModule {}
