import { User } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

@Injectable()
export class UsersRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("User");
	}

	/**
	 * 트랜잭션 컨텍스트 내에서는 트랜잭션 클라이언트, 그 외에서는 일반 클라이언트 반환
	 */
	private get prisma() {
		return this.txHost.tx;
	}

	/**
	 * Entity를 받아서 Prisma Args로 변환 후 생성
	 */
	async create(user: User): Promise<User> {
		this.logger.debug(`User 생성 중...`);
		const prismaData = this.entityToPrismaCreateInput(user);
		const result = await this.prisma.user.create({ data: prismaData });
		return plainToInstance(User, result);
	}

	/**
	 * Prisma Args를 직접 받는 생성 메서드 (복잡한 쿼리용)
	 */
	async createWithArgs(args: Prisma.UserCreateArgs): Promise<User> {
		this.logger.debug(`User 생성 중 (Args)...`);
		const result = await this.prisma.user.create(args);
		return plainToInstance(User, result);
	}

	async upsert(args: Prisma.UserUpsertArgs): Promise<User> {
		this.logger.debug(`User 업서트 중...`);
		const result = await this.prisma.user.upsert(args);
		return plainToInstance(User, result);
	}

	/**
	 * Partial<Entity>를 받아서 업데이트
	 */
	async update(id: string, userUpdate: Partial<User>): Promise<User> {
		this.logger.debug(`User 업데이트 중...`);
		const prismaData = this.entityToPrismaUpdateInput(userUpdate);
		const result = await this.prisma.user.update({
			where: { id },
			data: prismaData,
		});
		return plainToInstance(User, result);
	}

	/**
	 * Prisma Args를 직접 받는 업데이트 메서드 (복잡한 쿼리용)
	 */
	async updateWithArgs(args: Prisma.UserUpdateArgs): Promise<User> {
		this.logger.debug(`User 업데이트 중 (Args)...`);
		const result = await this.prisma.user.update(args);
		return plainToInstance(User, result);
	}

	async updateMany(
		args: Prisma.UserUpdateManyArgs,
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

	async createManyAndReturn(
		args: Prisma.UserCreateManyAndReturnArgs,
	): Promise<User[]> {
		this.logger.debug(`User 다중 생성 중...`);
		const result = await this.prisma.user.createManyAndReturn(args);
		return result.map((item) => plainToInstance(User, item));
	}

	async deleteMany(
		args: Prisma.UserDeleteManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`User 다중 삭제 중...`);
		return await this.prisma.user.deleteMany(args);
	}

	async aggregate(
		args: Prisma.UserAggregateArgs,
	): Promise<Prisma.GetUserAggregateType<typeof args>> {
		this.logger.debug(`User 집계 중...`);
		return await this.prisma.user.aggregate(args);
	}

	async count(args: Prisma.UserCountArgs): Promise<number> {
		this.logger.debug(`User 개수 세기 중...`);
		return await this.prisma.user.count(args);
	}

	/**
	 * Entity → Prisma CreateInput 변환 (private)
	 */
	private entityToPrismaCreateInput(user: User): Prisma.UserCreateInput {
		return {
			email: user.email,
			name: user.name,
			password: user.password,
			phone: user.phone,
			// Note: tenants, profiles, associations는 별도 관리
		};
	}

	/**
	 * Partial<Entity> → Prisma UpdateInput 변환 (private)
	 */
	private entityToPrismaUpdateInput(
		userUpdate: Partial<User>,
	): Prisma.UserUpdateInput {
		const data: Prisma.UserUpdateInput = {};

		if (userUpdate.email !== undefined) data.email = userUpdate.email;
		if (userUpdate.name !== undefined) data.name = userUpdate.name;
		if (userUpdate.phone !== undefined) data.phone = userUpdate.phone;
		if (userUpdate.password !== undefined) data.password = userUpdate.password;

		return data;
	}
}
