import { Injectable } from '@nestjs/common';
import { CreateAuthzDto } from './dto/create-authz.dto';
import { UpdateAuthzDto } from './dto/update-authz.dto';

@Injectable()
export class AuthzService {
  create(createAuthzDto: CreateAuthzDto) {
    return 'This action adds a new authz';
  }

  findAll() {
    return `This action returns all authz`;
  }

  findOne(id: number) {
    return `This action returns a #${id} authz`;
  }

  update(id: number, updateAuthzDto: UpdateAuthzDto) {
    return `This action updates a #${id} authz`;
  }

  remove(id: number) {
    return `This action removes a #${id} authz`;
  }
}
