import { Injectable } from '@nestjs/common';
import { last } from 'lodash';
import { queryBuilder } from '@common';
import { PaginatedTestTest, TestTestForm } from './models';
import {
  CreateTestTestInput,
  GetTestTestsArgs,
  UpdateTestTestInput,
} from './dto';
import { PrismaService } from '@modules/global/prisma/prisma.service';

@Injectable()
export class TestTestsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTestTestInput: CreateTestTestInput) {
    return this.prisma.testTest.create({
      data: createTestTestInput,
    });
  }

  findForm(): TestTestForm {
    return {
      id: '',
      name: '',
      name: '',
    };
  }

  async findPaginatedTestTest(
    args: GetTestTestsArgs,
  ): Promise<PaginatedTestTest> {
    const query = queryBuilder(args, []);

    const testTests = await this.prisma.testTest.findMany({
      ...query,
    });

    const totalCount = await this.prisma.testTest.count({
      where: query?.where,
    });

    const endCursor = last(testTests)?.id;

    return {
      edges: testTests.map(testTest => ({ node: testTest })),
      nodes: testTests,
      pageInfo: {
        totalCount,
        endCursor,
        hasNextPage: !(testTests.length < args.take),
      },
    };
  }

  delete(id: string) {
    return this.prisma.testTest.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  findOne(id: string) {
    return this.prisma.testTest.findUnique({
      where: { id },
    });
  }

  update(updateCategoryInput: UpdateTestTestInput) {
    return this.prisma.testTest.update({
      where: { id: updateCategoryInput.id },
      data: updateCategoryInput,
    });
  }
}
