import { Injectable } from '@nestjs/common';
import { CreateUserGroupCategoryInput } from './dto/create-user-group-category.input';
import { UpdateUserGroupCategoryInput } from './dto/update-user-group-category.input';

@Injectable()
export class UserGroupCategoriesService {
  create(createUserGroupCategoryInput: CreateUserGroupCategoryInput) {
    return 'This action adds a new userGroupCategory';
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
