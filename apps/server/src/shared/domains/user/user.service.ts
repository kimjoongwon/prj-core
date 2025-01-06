import { Injectable } from '@nestjs/common';
import { AssignmentsService } from '../../entities/assignments/assignments.service';
import { CreateUserAssignmentDto } from './dtos/create-user-assignment.dto';

@Injectable()
export class UserService {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  createUserAssignment({ userId, groupId }: CreateUserAssignmentDto) {
    return this.assignmentsService.create({
      data: {
        groupId,
        userId,
      },
    });
  }
}
