import { Injectable } from '@nestjs/common';
import { WorkspacesRepository } from '../repositories/workspaces.repository';
import { CreateWorkspaceDto, WorkspaceQueryDto, UpdateWorkspaceDto } from '../dtos';

@Injectable()
export class WorkspacesService {
  constructor(private readonly repository: WorkspacesRepository) {}

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

  create(createWorkspaceDto: CreateWorkspaceDto) {
    return this.repository.create({
      data: createWorkspaceDto,
    });
  }

  updateById(id: string, updateWorkspaceDto: UpdateWorkspaceDto) {
    return this.repository.update({
      where: { id },
      data: updateWorkspaceDto,
    });
  }

  async getManyByQuery(query: WorkspaceQueryDto) {
    const args = query.toArgs();
    const countArgs = query.toCountArgs();
    const workspaces = await this.repository.findMany(args);
    const count = await this.repository.count(countArgs);
    return {
      workspaces,
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
