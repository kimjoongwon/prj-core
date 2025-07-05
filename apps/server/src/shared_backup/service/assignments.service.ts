import { Injectable } from '@nestjs/common';
import { AssignmentsRepository } from '../repository/assignments.repository';
import { CreateAssignmentDto, QueryAssignmentDto, UpdateAssignmentDto } from '../dto';

@Injectable()
export class AssignmentsService {
  constructor(private readonly repository: AssignmentsRepository) {}

  getById(id: string) {
    return this.repository.findUnique({
      where: { id },
    });
  }

  removeManyByIds(ids: string[]) {
    return this.repository.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: { removedAt: new Date() },
    });
  }

  create(createAssignmentDto: CreateAssignmentDto) {
    return this.repository.create({
      data: createAssignmentDto,
    });
  }

  updateById(id: string, updateAssignmentDto: UpdateAssignmentDto) {
    return this.repository.update({
      where: { id },
      data: updateAssignmentDto,
    });
  }

  async getManyByQuery(query: QueryAssignmentDto) {
    const args = query.toArgs();
    const countArgs = query.toCountArgs();
    const assignments = await this.repository.findMany(args);
    const count = await this.repository.count(countArgs);
    return {
      assignments,
      count,
    };
  }

  deleteById(id: string) {
    return this.repository.delete({
      where: { id },
    });
  }

  removeById(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
