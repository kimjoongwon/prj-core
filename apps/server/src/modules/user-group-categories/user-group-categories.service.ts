import { Injectable } from '@nestjs/common';
import { CreateUserGroupCategoryInput } from './dto/create-user-group-category.input';
import { UpdateUserGroupCategoryInput } from './dto/update-user-group-category.input';
import { PrismaService } from '@modules/prisma/prisma.service';

@Injectable()
export class UserGroupCategoriesService {
  constructor(private readonly prisma: PrismaService) {}
  create(createUserGroupCategoryInput: CreateUserGroupCategoryInput) {
    return 'test';
  }

  findAll() {
    return `This action returns all userGroupCategories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userGroupCategory`;
  }

  update(
    id: number,
    updateUserGroupCategoryInput: UpdateUserGroupCategoryInput,
  ) {
    return `This action updates a #${id} userGroupCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} userGroupCategory`;
  }
}
