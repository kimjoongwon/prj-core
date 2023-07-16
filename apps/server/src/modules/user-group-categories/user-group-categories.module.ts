import { Module } from '@nestjs/common';
import { UserGroupCategoriesService } from './user-group-categories.service';
import { UserGroupCategoriesResolver } from './user-group-categories.resolver';

@Module({
  providers: [UserGroupCategoriesResolver, UserGroupCategoriesService],
})
export class UserGroupCategoriesModule {}
