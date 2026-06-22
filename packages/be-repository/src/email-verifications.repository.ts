import { EmailVerification } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

@Injectable()
export class EmailVerificationsRepository {
	private readonly logger = new Logger(EmailVerificationsRepository.name);

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {}

	async findById(id: string): Promise<EmailVerification | null> {
		const result = await this.txHost.tx.emailVerification.findUnique({
			where: { id },
		});

		return result ? plainToInstance(EmailVerification, result) : null;
	}

	async findLatestByEmail(email: string): Promise<EmailVerification | null> {
		this.logger.debug(`이메일 인증 최신 요청 조회: ${email}`);

		const result = await this.txHost.tx.emailVerification.findFirst({
			where: {
				email,
				removedAt: null,
			},
			orderBy: { createdAt: "desc" },
		});

		return result ? plainToInstance(EmailVerification, result) : null;
	}

	async findByTokenHash(tokenHash: string): Promise<EmailVerification | null> {
		const result = await this.txHost.tx.emailVerification.findUnique({
			where: { tokenHash },
		});

		return result ? plainToInstance(EmailVerification, result) : null;
	}

	async findMany(params: {
		where: Prisma.EmailVerificationWhereInput;
		orderBy: Prisma.EmailVerificationOrderByWithRelationInput[];
		skip: number;
		take: number;
	}): Promise<{ items: EmailVerification[]; totalCount: number }> {
		this.logger.debug("이메일 인증 목록 조회");

		const [items, totalCount] = await Promise.all([
			this.txHost.tx.emailVerification.findMany({
				where: params.where,
				orderBy: params.orderBy,
				skip: params.skip,
				take: params.take,
			}),
			this.txHost.tx.emailVerification.count({ where: params.where }),
		]);

		return {
			items: items.map((item) => plainToInstance(EmailVerification, item)),
			totalCount,
		};
	}

	async create(
		data: Prisma.EmailVerificationUncheckedCreateInput,
	): Promise<EmailVerification> {
		const result = await this.txHost.tx.emailVerification.create({ data });
		return plainToInstance(EmailVerification, result);
	}

	async updateById(
		id: string,
		data: Prisma.EmailVerificationUncheckedUpdateInput,
	): Promise<EmailVerification> {
		const result = await this.txHost.tx.emailVerification.update({
			where: { id },
			data,
		});

		return plainToInstance(EmailVerification, result);
	}
}
