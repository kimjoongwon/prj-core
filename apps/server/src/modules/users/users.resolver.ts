import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { User } from './models/user.model';
import { CreateUserInput } from './dto/create-user.input';
import { Profile } from '../profiles/entities/profile.entity';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { GqlAuthGuard, Public } from '../../common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginatedUser } from './models/paginated-user.model';
import { GetPaginatedUserArgs } from './dto/get-paginated-user.args';

@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Public()
  @Query(() => PaginatedUser, { name: 'users' })
  getUsers(@Args() getUsersArgs: GetPaginatedUserArgs) {
    return this.usersService.findPaginatedUsers(getUsersArgs);
  }

  @Public()
  @Query(() => User, { name: 'user' })
  getUser(@Args('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Public()
  @ResolveField(() => Profile, { name: 'profile' })
  getProfile(@Parent() parent: User) {
    const { id: userId } = parent;
    console.log('parent', parent);
    console.log('실행되니?');
    return parent.profile;
  }
}
