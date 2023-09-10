import { Injectable } from '@nestjs/common';
import { CreateUserWorkspaceInput } from './dto/create-user-workspace.input';
import { UpdateUserWorkspaceInput } from './dto/update-user-workspace.input';

@Injectable()
export class UserWorkspacesService {
  create(createUserWorkspaceInput: CreateUserWorkspaceInput) {
    return 'This action adds a new userWorkspace';
  }

  findAll() {
    return `This action returns all userWorkspaces`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userWorkspace`;
  }

  update(id: number, updateUserWorkspaceInput: UpdateUserWorkspaceInput) {
    return `This action updates a #${id} userWorkspace`;
  }

  remove(id: number) {
    return `This action removes a #${id} userWorkspace`;
  }
}
