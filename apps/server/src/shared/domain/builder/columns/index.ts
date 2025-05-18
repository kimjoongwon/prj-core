import { Global, Module } from '@nestjs/common';
import { CategoryColumns } from './category.columns';
import { RoutineColumns } from './routine.columns';
import { TenancyColumns } from './tenancy.columns';
import { UserColumns } from './user.columns';
import { ActionColumns } from './action.columns';
import { TaskColumns } from './task.columns';

@Module({
  providers: [
    CategoryColumns,
    RoutineColumns,
    TenancyColumns,
    UserColumns,
    ActionColumns,
    TaskColumns,
  ],
  exports: [
    CategoryColumns,
    RoutineColumns,
    TenancyColumns,
    UserColumns,
    ActionColumns,
    TaskColumns,
  ],
})
@Global()
export class ColumnsModule {}
