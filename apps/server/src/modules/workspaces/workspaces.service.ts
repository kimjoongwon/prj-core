import { Injectable } from '@nestjs/common';
import { CreateWorkspaceInput } from './dto/create-workspace.input';
import { UpdateWorkspaceInput } from './dto/update-workspace.input';
import { PrismaService } from '@modules/prisma/prisma.service';
import { GetPaginatedWorkspaceArgs } from './dto/get-paginated-workspace.args';
import { queryBuilder } from '@common';
import { PaginatedWorkspace } from './models/paginated-workspace.model';

@Injectable()
export class WorkspacesService {
  constructor(private readonly prisma: PrismaService) {}
  create(createWorkspaceInput: CreateWorkspaceInput) {
    return this.prisma.workspace.create({
      data: createWorkspaceInput,
    });
  }

  async findPaginatedWorkspace(
    getPaginatedWorkspaceArgs: GetPaginatedWorkspaceArgs,
  ): Promise<PaginatedWorkspace> {
    const query = queryBuilder(getPaginatedWorkspaceArgs);
    const workspaces = await this.prisma.workspace.findMany({
      ...query,
      include: { owner: true },
    });
    const totalCount = await this.prisma.workspace.count(query);
    return {
      totalCount,
      edges: [],
      nodes: workspaces,
      pageInfo: {
        hasNextPage: true,
      },
    };
  }

  findById(id: string) {
    return this.prisma.workspace.findUnique({
      where: { id },
    });
  }

  update(id: string, updateWorkspaceInput: UpdateWorkspaceInput) {
    return this.prisma.workspace.update({
      data: updateWorkspaceInput,
      where: { id },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} workspace`;
  }
}
