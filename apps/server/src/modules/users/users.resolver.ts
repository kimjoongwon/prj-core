import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { PaginatedUser } from './models/paginated-user.model';
import { UserForm } from './models/user-form.model';
import { User } from './models/user.model';
import { CreateUserInput } from './dto/create-user.input';
import { GetPaginatedUserArgs } from './dto/get-paginated-user.args';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from '../global/prisma/prisma.service';
import { GqlAuthGuard } from '../../common/guards';
import { Public } from '../../common/decorators';

@UseGuards(GqlAuthGuard)
@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly prismaService: PrismaService,
  ) {}

  @Public()
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
  @Query(() => UserForm, { name: 'userForm' })
  getUserForm(@Args('id') id: string) {
    return this.usersService.findForm(id);
  }

  @Public()
  @Query(() => User, { name: 'user' })
  getUser(@Args('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Public()
  @ResolveField()
  async profiles(@Parent() user: User) {
    return this.prismaService.user
      .findUnique({
        where: { id: user.id },
      })
      .profiles();
  }

  @Public()
  @ResolveField()
  async tenants(@Parent() user: User) {
    return this.prismaService.user
      .findUnique({ where: { id: user.id } })
      .tenants();
  }

  @Public()
  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }
}
