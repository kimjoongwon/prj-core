import { Injectable, Logger } from "@nestjs/common";
import { Prisma, UseEntity, User } from "@cocrepo/schema";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "../service/utils";

@Injectable()
@UseEntity(User)
export class UsersRepository {
  private readonly logger: Logger;

  constructor(private readonly prisma: PrismaService) {
    this.logger = new Logger("User");
  }

  async create(args: Prisma.UserCreateArgs): Promise<User> {
    this.logger.debug(`User 생성 중...`);
    const result = await this.prisma.user.create(args);
    return plainToInstance(User, result);
  }

  async upsert(args: Prisma.UserUpsertArgs): Promise<User> {
    this.logger.debug(`User 업서트 중...`);
    const result = await this.prisma.user.upsert(args);
    return plainToInstance(User, result);
  }

  async update(args: Prisma.UserUpdateArgs): Promise<User> {
    this.logger.debug(`User 업데이트 중...`);
    const result = await this.prisma.user.update(args);
    return plainToInstance(User, result);
  }

  async updateMany(
    args: Prisma.UserUpdateManyArgs
  ): Promise<Prisma.BatchPayload> {
    this.logger.debug(`User 다중 업데이트 중...`);
    return await this.prisma.user.updateMany(args);
  }

  async delete(args: Prisma.UserDeleteArgs): Promise<User> {
    this.logger.debug(`User 삭제 중...`);
    const result = await this.prisma.user.delete(args);
    return plainToInstance(User, result);
  }

  async findMany(args: Prisma.UserFindManyArgs): Promise<User[]> {
    this.logger.debug(`User 다중 조회 중...`);
    const result = await this.prisma.user.findMany(args);
    return result.map((item) => plainToInstance(User, item));
  }

  async findFirst(args: Prisma.UserFindFirstArgs): Promise<User> {
    this.logger.debug(`User 최초 조회 중...`);
    const result = await this.prisma.user.findFirst(args);
    return plainToInstance(User, result);
  }

  async findUnique(args: Prisma.UserFindUniqueArgs): Promise<User> {
    this.logger.debug(`User 고유 조회 중...`);
    const result = await this.prisma.user.findUnique(args);
    return plainToInstance(User, result);
  }

  async groupBy(args: any): Promise<any> {
    this.logger.debug(`User 그룹화 중...`);
    return await this.prisma.user.groupBy(args);
  }

  async createManyAndReturn(args: Prisma.UserCreateManyArgs): Promise<User[]> {
    this.logger.debug(`User 다중 생성 중...`);
    const result = await this.prisma.user.createManyAndReturn(args);
    return result.map((item) => plainToInstance(User, item));
  }

  async deleteMany(
    args: Prisma.UserDeleteManyArgs
  ): Promise<Prisma.BatchPayload> {
    this.logger.debug(`User 다중 삭제 중...`);
    return await this.prisma.user.deleteMany(args);
  }

  async aggregate(args: Prisma.UserAggregateArgs): Promise<any> {
    this.logger.debug(`User 집계 중...`);
    return await this.prisma.user.aggregate(args);
  }

  async count(args: Prisma.UserCountArgs): Promise<number> {
    this.logger.debug(`User 개수 세기 중...`);
    return await this.prisma.user.count(args);
  }
}
