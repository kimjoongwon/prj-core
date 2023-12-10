import { Injectable } from '@nestjs/common';
import { PrismaService } from '../global/prisma/prisma.service';
import { GetPaginatedUserArgs } from './dto/get-paginated-user.args';
import { last } from 'lodash';
import { UpdateUserInput } from './dto/update-user.input';
import { CreateUserInput } from './dto/create-user.input';
import { queryBuilder } from '../../common/utils';
import { UserForm, defaultUserForm } from './models/user-form.model';
import { SpacesService } from '../spaces/spaces.service';
import { RolesService } from '../roles/roles.service';
import { PasswordService } from '../auth/providers/password.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly spacesService: SpacesService,
    private readonly rolesService: RolesService,
    private readonly passwordService: PasswordService,
  ) {}

  async create(createUserInput: CreateUserInput) {
    const hashPassword = await this.passwordService.hashPassword(
      createUserInput.password,
    );

    return this.prisma.user.create({
      data: {
        name: createUserInput.name,
        email: createUserInput.email,
        password: hashPassword,
        tenants: {
          create: {
            roleId: createUserInput.roleId,
            spaceId: createUserInput.spaceId,
          },
        },
        profiles: {
          create: {
            nickname: createUserInput.nickname,
            phone: createUserInput.phone,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findPaginatedUsers(args: GetPaginatedUserArgs) {
    const query = queryBuilder(args, ['email']);

    const users = await this.prisma.user.findMany({
      include: {
        tenants: true,
        profiles: true,
      },
    });

    const totalCount = await this.prisma.user.count({
      where: query?.where,
    });

    const endCursor = last(users)?.id;

    return {
      edges: users.map(user => ({ node: user })),
      nodes: users,
      pageInfo: {
        totalCount,
        endCursor,
        hasNextPage: true,
      },
    };
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findForm(id: string): Promise<UserForm> {
    const spaceOptions = await this.spacesService.getServiceOptions();
    const roleOptions = await this.rolesService.getRoleOptions();

    const userForm = { ...defaultUserForm };
    userForm.spaceOptions = spaceOptions;
    userForm.roleOptions = roleOptions;
    if (id === 'new') {
      userForm.roleId = roleOptions[0].value;
      return userForm;
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return {
      ...userForm,
      password: '',
      name: user.name,
      email: user.email,
    };
  }

  update(id: string, updateUserInput: UpdateUserInput) {
    return this.prisma.user.update({
      where: { id },
      data: {
        email: updateUserInput.email,
        name: updateUserInput.name,
      },
    });
  }
}
