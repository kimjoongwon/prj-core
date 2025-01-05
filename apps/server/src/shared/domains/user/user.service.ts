import { Injectable } from '@nestjs/common';
import { AssignmentsService } from '../../entities/assignments/assignments.service';
import { UsersService } from '../../entities/users/users.service';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserAssignmentDto } from './dtos/create-user-assignment.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly assignmentsService: AssignmentsService,
  ) {}

  createUserAssignment({ userId, groupId }: CreateUserAssignmentDto) {
    return this.prisma.$transaction(async () => {
      const { id: assignmentId } = await this.assignmentsService.create({
        data: {
          groupId,
        },
      });

      await this.usersService.update({
        where: {
          id: userId,
        },
        data: {
          assignmentIds: {
            set: [assignmentId],
          },
        },
      });
    });
  }
}
