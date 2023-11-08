import { Injectable } from '@nestjs/common';
import { last } from 'lodash';
import { queryBuilder } from '@common';
import { PaginatedWorkspace, WorkspaceForm } from './models';
import {
  CreateWorkspaceInput,
  GetWorkspacesArgs,
  UpdateWorkspaceInput,
} from './dto';
import { PrismaService } from '@modules/global/prisma/prisma.service';

@Injectable()
export class WorkspacesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createWorkspaceInput: CreateWorkspaceInput) {
    return this.prisma.workspace.create({
      data: createWorkspaceInput,
    });
  }

  async findForm(id: string): Promise<WorkspaceForm> {
    console.log('id', id);
    if (id === 'new') {
      return {
        name: '',
        address: '',
        businessNumber: '',
        phone: '',
      };
    }

    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
    });

    return {
      address: workspace.address,
      businessNumber: workspace.businessNumber,
      name: workspace.name,
      phone: workspace.phone,
    };
  }

  async findPaginatedWorkspace(
    args: GetWorkspacesArgs,
  ): Promise<PaginatedWorkspace> {
    const query = queryBuilder(args, []);

    const workspaces = await this.prisma.workspace.findMany({
      ...query,
    });

    const totalCount = await this.prisma.workspace.count({
      where: query?.where,
    });

    const endCursor = last(workspaces)?.id;

    return {
      edges: workspaces.map(workspace => ({ node: workspace })),
      nodes: workspaces,
      pageInfo: {
        totalCount,
        endCursor,
        hasNextPage: !(workspaces.length < args.take),
      },
    };
  }

  delete(id: string) {
    return this.prisma.workspace.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  findOne(id: string) {
    return this.prisma.workspace.findUnique({
      where: { id },
    });
  }

  update(updateCategoryInput: UpdateWorkspaceInput) {
    return this.prisma.workspace.update({
      where: { id: updateCategoryInput.id },
      data: updateCategoryInput,
    });
  }
}
