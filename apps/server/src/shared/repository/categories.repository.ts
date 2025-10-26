import { Injectable, Logger } from "@nestjs/common";
import { Category, Prisma, UseEntity } from "@cocrepo/schema";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "../service/utils";

@Injectable()
@UseEntity(Category)
export class CategoriesRepository {
  private readonly logger: Logger;

  constructor(private readonly prisma: PrismaService) {
    this.logger = new Logger("Category");
  }

  async create(args: Prisma.CategoryCreateArgs): Promise<Category> {
    this.logger.debug(`Category 생성 중...`);
    const result = await this.prisma.category.create(args);
    return plainToInstance(Category, result);
  }

  async upsert(args: Prisma.CategoryUpsertArgs): Promise<Category> {
    this.logger.debug(`Category 업서트 중...`);
    const result = await this.prisma.category.upsert(args);
    return plainToInstance(Category, result);
  }

  async update(args: Prisma.CategoryUpdateArgs): Promise<Category> {
    this.logger.debug(`Category 업데이트 중...`);
    const result = await this.prisma.category.update(args);
    return plainToInstance(Category, result);
  }

  async updateMany(
    args: Prisma.CategoryUpdateManyArgs
  ): Promise<Prisma.BatchPayload> {
    this.logger.debug(`Category 다중 업데이트 중...`);
    return await this.prisma.category.updateMany(args);
  }

  async delete(args: Prisma.CategoryDeleteArgs): Promise<Category> {
    this.logger.debug(`Category 삭제 중...`);
    const result = await this.prisma.category.delete(args);
    return plainToInstance(Category, result);
  }

  async findMany(args: Prisma.CategoryFindManyArgs): Promise<Category[]> {
    this.logger.debug(`Category 다중 조회 중...`);
    const result = await this.prisma.category.findMany(args);
    return result.map((item) => plainToInstance(Category, item));
  }

  async findFirst(args: Prisma.CategoryFindFirstArgs): Promise<Category> {
    this.logger.debug(`Category 최초 조회 중...`);
    const result = await this.prisma.category.findFirst(args);
    return plainToInstance(Category, result);
  }

  async findUnique(args: Prisma.CategoryFindUniqueArgs): Promise<Category> {
    this.logger.debug(`Category 고유 조회 중...`);
    const result = await this.prisma.category.findUnique(args);
    return plainToInstance(Category, result);
  }

  async groupBy(args: any): Promise<any> {
    this.logger.debug(`Category 그룹화 중...`);
    return await this.prisma.category.groupBy(args);
  }

  async createManyAndReturn(
    args: Prisma.CategoryCreateManyArgs
  ): Promise<Category[]> {
    this.logger.debug(`Category 다중 생성 중...`);
    const result = await this.prisma.category.createManyAndReturn(args);
    return result.map((item) => plainToInstance(Category, item));
  }

  async deleteMany(
    args: Prisma.CategoryDeleteManyArgs
  ): Promise<Prisma.BatchPayload> {
    this.logger.debug(`Category 다중 삭제 중...`);
    return await this.prisma.category.deleteMany(args);
  }

  async aggregate(args: Prisma.CategoryAggregateArgs): Promise<any> {
    this.logger.debug(`Category 집계 중...`);
    return await this.prisma.category.aggregate(args);
  }

  async count(args: Prisma.CategoryCountArgs): Promise<number> {
    this.logger.debug(`Category 개수 세기 중...`);
    return await this.prisma.category.count(args);
  }

  async findLastLeafCategoriesByServiceName() {
    const categories = await this.prisma.category.findMany({
      where: {
        children: {
          none: {},
        },
      },
      include: {
        parent: {
          include: { parent: true },
        },
        children: {
          include: {
            children: true,
          },
        },
      },
    });

    return categories.map((category) => plainToInstance(Category, category));
  }
}
