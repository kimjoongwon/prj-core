import { EmailVerification } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import type {
	AutoIdentityCreateInput,
	AutoIdentityUpdateInput,
} from "./auto-identity-input.type";
import { toDomainEntity } from "./to-domain-entity";

@Injectable()
export class EmailVerificationsRepository {
	private readonly logger = new Logger(EmailVerificationsRepository.name);

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {}

	async findById(id: bigint): Promise<EmailVerification | null> {
		const result = await this.txHost.tx.emailVerification.findUnique({
			where: { id },
			include: { space: true, verifiedUser: true },
		});

		return result ? toDomainEntity(EmailVerification, result) : null;
	}

	async findLatestByEmail(email: string): Promise<EmailVerification | null> {
		this.logger.debug(`이메일 인증 최신 요청 조회: ${email}`);

		const result = await this.txHost.tx.emailVerification.findFirst({
			where: {
				email,
				removedAt: null,
			},
			orderBy: { createdAt: "desc" },
			include: { space: true, verifiedUser: true },
		});

		return result ? toDomainEntity(EmailVerification, result) : null;
	}

	async findByTokenHash(tokenHash: string): Promise<EmailVerification | null> {
		const result = await this.txHost.tx.emailVerification.findUnique({
			where: { tokenHash },
			include: { space: true, verifiedUser: true },
		});

		return result ? toDomainEntity(EmailVerification, result) : null;
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
				include: { space: true, verifiedUser: true },
			}),
			this.txHost.tx.emailVerification.count({ where: params.where }),
		]);

		return {
			items: items.map((item) => toDomainEntity(EmailVerification, item)),
			totalCount,
		};
	}

	async create(
		data: AutoIdentityCreateInput<
			Prisma.EmailVerificationUncheckedCreateInput,
			"emailVerificationId"
		>,
	): Promise<EmailVerification> {
		const result = await this.txHost.tx.emailVerification.create({
			data,
			include: { space: true, verifiedUser: true },
		});
		return toDomainEntity(EmailVerification, result);
	}

	async updateById(
		id: bigint,
		data: AutoIdentityUpdateInput<
			Prisma.EmailVerificationUncheckedUpdateInput,
			"emailVerificationId"
		>,
	): Promise<EmailVerification> {
		const result = await this.txHost.tx.emailVerification.update({
			where: { id },
			data,
			include: { space: true, verifiedUser: true },
		});

		return toDomainEntity(EmailVerification, result);
	}
}
