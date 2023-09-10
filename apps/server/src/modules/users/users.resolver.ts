import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { PaginatedUser, User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { Profile } from '../profiles/entities/profile.entity';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { GqlAuthGuard, Public } from '../../common';
import { GetUsersArgs } from './dto/get-users.args';
import { PrismaService } from '../prisma/prisma.service';
import { Ctx } from '@nestjs/microservices';

@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService, // private readonly logger: Logger,
  ) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Public()
  @Query(() => PaginatedUser, { name: 'users' })
  getUsers(@Args() getUsersArgs: GetUsersArgs) {
    return this.usersService.findByArgs(getUsersArgs);
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
    return this.prisma.profile.findUnique({
      where: {
        userId,
      },
    });
  }
}
