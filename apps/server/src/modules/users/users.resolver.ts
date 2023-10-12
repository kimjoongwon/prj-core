import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  createUnionType,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User, UserForm, Users } from './models';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, Public } from '@common';
import { GetPaginatedUserArgs, UpdateUserInput } from './dto';
import { Profile } from '@modules/profiles/entities/profile.entity';

@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Query(() => Users, { name: 'users' })
  getUsers(@Args() getUsersArgs: GetPaginatedUserArgs) {
    return this.usersService.findPaginatedUsers(getUsersArgs);
  }

  @Public()
  @Query(() => User, { name: 'user' })
  getUser(@Args('cuid') cuid: string) {
    return this.usersService.findOne(cuid);
  }

  @Public()
  @Query(() => UserForm, { name: 'userForm' })
  getUserForm(@Args('cuid') cuid: string) {
    return this.usersService.findForm(cuid);
  }

  @Public()
  @ResolveField(() => Profile, { name: 'profile' })
  getProfile(@Parent() parent: User) {
    return parent.profile;
  }

  @Public()
  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }
}
