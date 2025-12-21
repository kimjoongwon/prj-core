import { Prisma } from "@prisma/client";
import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../service/utils";

@Injectable()
export class SafeWalletRepository {
	private readonly logger: Logger;

	constructor(private readonly prisma: PrismaService) {
		this.logger = new Logger("SafeWallet");
	}

	async create(args: any) {
		this.logger.debug(`SafeWallet 생성 중...`);
		return await this.prisma.safeWallet.create(args);
	}

	async findMany(args: any) {
		this.logger.debug(`SafeWallet 다중 조회 중...`);
		return await this.prisma.safeWallet.findMany(args);
	}

	async findUnique(args: any) {
		this.logger.debug(`SafeWallet 고유 조회 중...`);
		return await this.prisma.safeWallet.findUnique(args);
	}

	async findFirst(args: any) {
		this.logger.debug(`SafeWallet 최초 조회 중...`);
		return await this.prisma.safeWallet.findFirst(args);
	}

	async update(args: any) {
		this.logger.debug(`SafeWallet 업데이트 중...`);
		return await this.prisma.safeWallet.update(args);
	}

	async delete(args: any) {
		this.logger.debug(`SafeWallet 삭제 중...`);
		return await this.prisma.safeWallet.delete(args);
	}
}

@Injectable()
export class SafeTransactionRepository {
	private readonly logger: Logger;

	constructor(private readonly prisma: PrismaService) {
		this.logger = new Logger("SafeTransaction");
	}

	async create(args: any) {
		this.logger.debug(`SafeTransaction 생성 중...`);
		return await this.prisma.safeTransaction.create(args);
	}

	async findMany(args: any) {
		this.logger.debug(`SafeTransaction 다중 조회 중...`);
		return await this.prisma.safeTransaction.findMany(args);
	}

	async findUnique(args: any) {
		this.logger.debug(`SafeTransaction 고유 조회 중...`);
		return await this.prisma.safeTransaction.findUnique(args);
	}

	async findFirst(args: any) {
		this.logger.debug(`SafeTransaction 최초 조회 중...`);
		return await this.prisma.safeTransaction.findFirst(args);
	}

	async update(args: any) {
		this.logger.debug(`SafeTransaction 업데이트 중...`);
		return await this.prisma.safeTransaction.update(args);
	}

	async delete(args: any) {
		this.logger.debug(`SafeTransaction 삭제 중...`);
		return await this.prisma.safeTransaction.delete(args);
	}
}

@Injectable()
export class SafeConfirmationRepository {
	private readonly logger: Logger;

	constructor(private readonly prisma: PrismaService) {
		this.logger = new Logger("SafeConfirmation");
	}

	async create(args: any) {
		this.logger.debug(`SafeConfirmation 생성 중...`);
		return await this.prisma.safeConfirmation.create(args);
	}

	async findMany(args: any) {
		this.logger.debug(`SafeConfirmation 다중 조회 중...`);
		return await this.prisma.safeConfirmation.findMany(args);
	}

	async findUnique(args: any) {
		this.logger.debug(`SafeConfirmation 고유 조회 중...`);
		return await this.prisma.safeConfirmation.findUnique(args);
	}

	async upsert(args: any) {
		this.logger.debug(`SafeConfirmation 업서트 중...`);
		return await this.prisma.safeConfirmation.upsert(args);
	}
}
