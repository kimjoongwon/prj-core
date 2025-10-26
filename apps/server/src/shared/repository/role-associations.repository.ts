import { Injectable, Logger } from "@nestjs/common";
import { Prisma, RoleAssociation, UseEntity } from "@cocrepo/schema";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "../service/utils";

@Injectable()
@UseEntity(RoleAssociation)
export class RoleAssociationsRepository {
  private readonly logger: Logger;

  constructor(private readonly prisma: PrismaService) {
    this.logger = new Logger("RoleAssociation");
  }

  async create(
    args: Prisma.RoleAssociationCreateArgs
  ): Promise<RoleAssociation> {
    this.logger.debug(`RoleAssociation 생성 중...`);
    const result = await this.prisma.roleAssociation.create(args);
    return plainToInstance(RoleAssociation, result);
  }

  async upsert(
    args: Prisma.RoleAssociationUpsertArgs
  ): Promise<RoleAssociation> {
    this.logger.debug(`RoleAssociation 업서트 중...`);
    const result = await this.prisma.roleAssociation.upsert(args);
    return plainToInstance(RoleAssociation, result);
  }

  async update(
    args: Prisma.RoleAssociationUpdateArgs
  ): Promise<RoleAssociation> {
    this.logger.debug(`RoleAssociation 업데이트 중...`);
    const result = await this.prisma.roleAssociation.update(args);
    return plainToInstance(RoleAssociation, result);
  }

  async updateMany(
    args: Prisma.RoleAssociationUpdateManyArgs
  ): Promise<Prisma.BatchPayload> {
    this.logger.debug(`RoleAssociation 다중 업데이트 중...`);
    return await this.prisma.roleAssociation.updateMany(args);
  }

  async delete(
    args: Prisma.RoleAssociationDeleteArgs
  ): Promise<RoleAssociation> {
    this.logger.debug(`RoleAssociation 삭제 중...`);
    const result = await this.prisma.roleAssociation.delete(args);
    return plainToInstance(RoleAssociation, result);
  }

  async findMany(
    args: Prisma.RoleAssociationFindManyArgs
  ): Promise<RoleAssociation[]> {
    this.logger.debug(`RoleAssociation 다중 조회 중...`);
    const result = await this.prisma.roleAssociation.findMany(args);
    return result.map((item) => plainToInstance(RoleAssociation, item));
  }

  async findFirst(
    args: Prisma.RoleAssociationFindFirstArgs
  ): Promise<RoleAssociation> {
    this.logger.debug(`RoleAssociation 최초 조회 중...`);
    const result = await this.prisma.roleAssociation.findFirst(args);
    return plainToInstance(RoleAssociation, result);
  }

  async findUnique(
    args: Prisma.RoleAssociationFindUniqueArgs
  ): Promise<RoleAssociation> {
    this.logger.debug(`RoleAssociation 고유 조회 중...`);
    const result = await this.prisma.roleAssociation.findUnique(args);
    return plainToInstance(RoleAssociation, result);
  }

  async groupBy(args: any): Promise<any> {
    this.logger.debug(`RoleAssociation 그룹화 중...`);
    return await this.prisma.roleAssociation.groupBy(args);
  }

  async createManyAndReturn(
    args: Prisma.RoleAssociationCreateManyArgs
  ): Promise<RoleAssociation[]> {
    this.logger.debug(`RoleAssociation 다중 생성 중...`);
    const result = await this.prisma.roleAssociation.createManyAndReturn(args);
    return result.map((item) => plainToInstance(RoleAssociation, item));
  }

  async deleteMany(
    args: Prisma.RoleAssociationDeleteManyArgs
  ): Promise<Prisma.BatchPayload> {
    this.logger.debug(`RoleAssociation 다중 삭제 중...`);
    return await this.prisma.roleAssociation.deleteMany(args);
  }

  async aggregate(args: Prisma.RoleAssociationAggregateArgs): Promise<any> {
    this.logger.debug(`RoleAssociation 집계 중...`);
    return await this.prisma.roleAssociation.aggregate(args);
  }

  async count(args: Prisma.RoleAssociationCountArgs): Promise<number> {
    this.logger.debug(`RoleAssociation 개수 세기 중...`);
    return await this.prisma.roleAssociation.count(args);
  }
}
