import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiResponseEntity, Auth } from '../../../../shared/decorator';
import { ResponseEntity } from '../../../../shared/entity';
import { PrismaService } from 'nestjs-prisma';
import { ContextProvider } from '../../../../shared/provider';
import { TenantsPage } from '../pages/tenants.page';
import { CategoriesPage } from '../pages/categories.page';
import { GroupsPage } from '../pages/groups.page';
import { GroupPage } from '../pages/group.page';
import { TimelinesPage } from '../pages/timelines.page';
import { TimelineEditPage } from '../pages/timeline-edit.page';
import { SessionsPage } from '../pages/sessions.page';
import { SessionEditPage } from '../pages/session-edit.page';
import { RoutinesPage } from '../pages/routines.page';
import { RoutineEditPage } from '../pages/routine-edit.page';
import { TasksPage } from '../pages/tasks.page';
import { TaskEditPage } from '../pages/task-edit.page';
import { ExercisesPage } from '../pages/exercises.page';
import { ExerciseEditPage } from '../pages/exercise-edit.page';
import { CategoryPage } from '../pages/category.page';
import { GroundsPage } from '../pages/grounds.page';
import { GroundPage } from '../pages/ground.page';

@Controller()
export class AdminMainRouteController {
  constructor(
    readonly tenantsPage: TenantsPage,
    readonly categoriesPage: CategoriesPage,
    readonly categoryPage: CategoryPage,
    readonly groupsPage: GroupsPage,
    readonly groupPage: GroupPage,
    readonly timelinesPage: TimelinesPage,
    readonly timelineEditPage: TimelineEditPage,
    readonly sessionsPage: SessionsPage,
    readonly sessinoEditPage: SessionEditPage,
    readonly routinesPage: RoutinesPage,
    readonly routineEditPage: RoutineEditPage,
    readonly tasksPage: TasksPage,
    readonly taskEditPage: TaskEditPage,
    readonly exercisesPage: ExercisesPage,
    readonly exerciseEditPage: ExerciseEditPage,
    readonly groundsPage: GroundsPage,
    readonly groundPage: GroundPage,
    readonly prisma: PrismaService,
  ) {}

  @Auth()
  @Get('tenants')
  @ApiResponseEntity(Object)
  getAdminMainTenantsPage() {
    const route = this.tenantsPage.getMeta();
    return new ResponseEntity(HttpStatus.OK, 'Tenancies is OK', route);
  }

  @Auth()
  @ApiResponseEntity(Object)
  @Get('categories')
  getAdminMainCategoriesPage() {
    const route = this.categoriesPage.build();
    return new ResponseEntity(HttpStatus.OK, 'Categories is OK', route);
  }

  @Auth()
  @Get('categories/:categoryId/:type')
  @ApiResponseEntity(Object)
  async getAdminMainCategoriesEditPage(
    @Param('categoryId') categoryId: string,
    @Param('type') type: 'modify' | 'create' | 'detail',
  ) {
    ContextProvider.setPageContext(type);
    const route = await this.categoryPage.build(categoryId, type);
    return new ResponseEntity(HttpStatus.OK, 'Categories Edit is OK', route);
  }

  @Auth()
  @Get('services')
  @ApiResponseEntity(Object, HttpStatus.OK, { isArray: true })
  async getAdminMainServicesPage() {
    const tenancyId = ContextProvider.getTenancyId();
    const services = await this.prisma.service.findMany();
    const servicePages = services.map((service) => {
      return {
        name: service.name,
        pathname: `/admin/main/tenancies/${tenancyId}/services/${service.id}`,
      };
    });

    return new ResponseEntity(HttpStatus.OK, 'Services is OK', servicePages);
  }

  @Auth()
  @Get('groups')
  @ApiResponseEntity(Object, HttpStatus.OK, { isArray: true })
  async getAdminMainGroupsPage() {
    const route = await this.groupsPage.getMeta();
    return new ResponseEntity(HttpStatus.OK, 'Groups is OK', route);
  }

  @Auth()
  @Get('groups/:groupId/:type')
  @ApiResponseEntity(Object, HttpStatus.OK)
  async getAdminMainGroupEditPage(
    @Param('groupId') groupId: string,
    @Param('type') type: 'edit' | 'add' | 'detail',
  ) {
    ContextProvider.setPageContext(type);
    const route = await this.groupPage.build(groupId, type);
    return new ResponseEntity(HttpStatus.OK, 'Groups Edit is OK', route);
  }

  @Auth()
  @Get('timelines')
  @ApiResponseEntity(Object, HttpStatus.OK)
  async getAdminMainTimelinesPage() {
    const route = await this.timelinesPage.getMeta();
    return new ResponseEntity(HttpStatus.OK, 'OK', route);
  }

  @Auth()
  @Get('timelines/:timelineId/:type')
  @ApiResponseEntity(Object, HttpStatus.OK)
  async getAdminMainTimelineEditPage(
    @Param('timelineId') timelineId: string,
    @Param('type') type: 'edit' | 'add',
  ) {
    const route = await this.timelineEditPage.getMeta(timelineId, type);
    return new ResponseEntity(HttpStatus.OK, 'OK', route);
  }

  @Auth()
  @Get('sessions')
  @ApiResponseEntity(Object, HttpStatus.OK)
  getAdminMainSessionsPage() {
    const route = this.sessionsPage.getMeta();
    return new ResponseEntity(HttpStatus.OK, 'Sessions is OK', route);
  }

  @Auth()
  @Get('sessions/:sessionId/:type')
  @ApiResponseEntity(Object, HttpStatus.OK)
  async getAdminMainSessionEditPage(
    @Param('sessionId') sessionId: string,
    @Param('type') type: 'edit' | 'add',
  ) {
    const route = await this.sessinoEditPage.getMeta(sessionId, type);
    return new ResponseEntity(HttpStatus.OK, 'Sessions Edit is OK', route);
  }

  @Auth()
  @Get('routines')
  @ApiResponseEntity(Object, HttpStatus.OK)
  getAdminMainRoutinesPage() {
    const route = this.routinesPage.getMeta();
    return ResponseEntity.WITH_ROUTE(route);
  }

  @Auth()
  @Get('routines/:routineId/:type')
  @ApiResponseEntity(Object, HttpStatus.OK)
  async getAdminMainRoutineEditPage(
    @Param('routineId') routineId: string,
    @Param('type') type: 'edit' | 'add',
  ) {
    const route = await this.routineEditPage.getMeta(routineId, type);
    return ResponseEntity.WITH_ROUTE(route);
  }

  @Auth()
  @Get('tasks')
  @ApiResponseEntity(Object, HttpStatus.OK)
  getAdminMainTasksPage() {
    const route = this.tasksPage.getMeta();
    return ResponseEntity.WITH_ROUTE(route);
  }

  @Auth()
  @Get('tasks/:taskId/:type')
  @ApiResponseEntity(Object, HttpStatus.OK)
  async getAdminMainTaskEditPage(
    @Param('taskId') taskId: string,
    @Param('type') type: 'edit' | 'add',
  ) {
    const route = await this.taskEditPage.getMeta(taskId, type);
    return ResponseEntity.WITH_ROUTE(route);
  }

  @Auth()
  @Get('exercises')
  @ApiResponseEntity(Object, HttpStatus.OK)
  getAdminMainExercisesPage() {
    const route = this.exercisesPage.getMeta();
    return ResponseEntity.WITH_ROUTE(route);
  }

  @Auth()
  @Get('exercises/:exerciseId/:type')
  @ApiResponseEntity(Object, HttpStatus.OK)
  async getAdminMainExerciseEditPage(
    @Param('exerciseId') exerciseId: string,
    @Param('type') type: 'edit' | 'add',
  ) {
    const route = await this.exerciseEditPage.getMeta(exerciseId, type);
    return ResponseEntity.WITH_ROUTE(route);
  }

  @Auth()
  @Get('grounds')
  @ApiResponseEntity(Object, HttpStatus.OK)
  async getAdminMainGroundsPage() {
    const route = await this.groundsPage.build();
    return new ResponseEntity(HttpStatus.OK, 'Grounds is OK', route);
  }

  @Auth()
  @Get('grounds/:groundId/:type')
  @ApiResponseEntity(Object, HttpStatus.OK)
  async getAdminMainGroundPage(
    @Param('groundId') groundId: string,
    @Param('type') type: 'edit' | 'add' | 'detail',
  ) {
    ContextProvider.setPageContext(type);
    const route = await this.groundPage.build(groundId, type);
    return new ResponseEntity(HttpStatus.OK, 'Grounds Edit is OK', route);
  }
}
