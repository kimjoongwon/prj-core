import { Injectable } from '@nestjs/common';
import { AssociationsService } from '../../entities/associations/associations.service';
import { CreateUserAssociationDto } from './dtos/create-user-assignment.dto';

@Injectable()
export class UserService {
  constructor(private readonly associationsService: AssociationsService) {}

  createUserAssociation({ userId, groupId }: CreateUserAssociationDto) {
    return this.associationsService.create({
      data: {
        groupId,
        userId,
      },
    });
  }
}
