import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, Public } from '@common';
import { UserServicesService } from './user-services.service';
import { PaginatedUserService, UserService, UserServiceForm } from './models';
import {
  CreateUserServiceInput,
  GetUserServicesArgs,
  UpdateUserServiceInput,
} from './dto';

@Resolver(() => UserService)
@UseGuards(GqlAuthGuard)
export class UserServicesResolver {
  constructor(private readonly userServices: UserServicesService) {}

  @Public()
  @Mutation(() => UserService)
  createUserService(
    @Args('createUserServiceInput')
    createUserServiceInput: CreateUserServiceInput,
  ) {
    return this.userServicesService.create(createUserServiceInput);
  }

  @Public()
  @Mutation(() => UserService)
  updateUserService(
    @Args('updateUserServiceInput')
    updateUserServiceInput: UpdateUserServiceInput,
  ) {
    return this.userServicesService.update(updateUserServiceInput);
  }

  @Public()
  @Mutation(() => UserService)
  deleteUserService(@Args('id') id: string) {
    return this.userServicesService.delete(id);
  }

  @Public()
  @Query(() => UserService, { name: 'user_service' })
  getUserService(@Args('id') id: string) {
    return this.userServicesService.findOne(id);
  }

  @Public()
  @Query(() => UserServiceForm, { name: 'user_serviceForm' })
  getUserServiceForm() {
    return this.userServicesService.findForm();
  }

  @Public()
  @Query(() => PaginatedUserService, { name: 'user_services' })
  getUserServices(@Args() args: GetUserServicesArgs) {
    return this.userServicesService.findPaginatedUserService(args);
  }
}
