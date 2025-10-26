import { Injectable, Logger } from "@nestjs/common";
import { Prisma, Role, UseEntity } from "@cocrepo/schema";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "../service/utils";

@Injectable()
@UseEntity(Role)
export class RolesRepository {
  private readonly logger: Logger;

  constructor(private readonly prisma: PrismaService) {
    this.logger = new Logger("Role");
  }

  async create(args: Prisma.RoleCreateArgs): Promise<Role> {
    this.logger.debug(`Role 생성 중...`);
    const result = await this.prisma.role.create(args);
    return plainToInstance(Role, result);
  }

  async upsert(args: Prisma.RoleUpsertArgs): Promise<Role> {
    this.logger.debug(`Role 업서트 중...`);
    const result = await this.prisma.role.upsert(args);
    return plainToInstance(Role, result);
  }

  async update(args: Prisma.RoleUpdateArgs): Promise<Role> {
    this.logger.debug(`Role 업데이트 중...`);
    const result = await this.prisma.role.update(args);
    return plainToInstance(Role, result);
  }

  async updateMany(
    args: Prisma.RoleUpdateManyArgs
  ): Promise<Prisma.BatchPayload> {
    this.logger.debug(`Role 다중 업데이트 중...`);
    return await this.prisma.role.updateMany(args);
  }

  async delete(args: Prisma.RoleDeleteArgs): Promise<Role> {
    this.logger.debug(`Role 삭제 중...`);
    const result = await this.prisma.role.delete(args);
    return plainToInstance(Role, result);
  }

  async findMany(args: Prisma.RoleFindManyArgs): Promise<Role[]> {
    this.logger.debug(`Role 다중 조회 중...`);
    const result = await this.prisma.role.findMany(args);
    return result.map((item) => plainToInstance(Role, item));
  }

  async findFirst(args: Prisma.RoleFindFirstArgs): Promise<Role> {
    this.logger.debug(`Role 최초 조회 중...`);
    const result = await this.prisma.role.findFirst(args);
    return plainToInstance(Role, result);
  }

  async findUnique(args: Prisma.RoleFindUniqueArgs): Promise<Role> {
    this.logger.debug(`Role 고유 조회 중...`);
    const result = await this.prisma.role.findUnique(args);
    return plainToInstance(Role, result);
  }

  async groupBy(args: any): Promise<any> {
    this.logger.debug(`Role 그룹화 중...`);
    return await this.prisma.role.groupBy(args);
  }

  async createManyAndReturn(args: Prisma.RoleCreateManyArgs): Promise<Role[]> {
    this.logger.debug(`Role 다중 생성 중...`);
    const result = await this.prisma.role.createManyAndReturn(args);
    return result.map((item) => plainToInstance(Role, item));
  }

  async deleteMany(
    args: Prisma.RoleDeleteManyArgs
  ): Promise<Prisma.BatchPayload> {
    this.logger.debug(`Role 다중 삭제 중...`);
    return await this.prisma.role.deleteMany(args);
  }

  async aggregate(args: Prisma.RoleAggregateArgs): Promise<any> {
    this.logger.debug(`Role 집계 중...`);
    return await this.prisma.role.aggregate(args);
  }

  async count(args: Prisma.RoleCountArgs): Promise<number> {
    this.logger.debug(`Role 개수 세기 중...`);
    return await this.prisma.role.count(args);
  }
}
