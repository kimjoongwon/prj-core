import { Global, Module } from '@nestjs/common';
import { CategoryColumns } from './category.columns';
import { RoutineColumns } from './routine.columns';
import { TenancyColumns } from './tenancy.columns';
import { UserColumns } from './user.columns';
import { ActionColumns } from './action.columns';

const modules = [CategoryColumns, RoutineColumns, TenancyColumns, UserColumns, ActionColumns];

@Global()
@Module({
  providers: modules,
  exports: modules,
})
export class ColumnsModule {}
