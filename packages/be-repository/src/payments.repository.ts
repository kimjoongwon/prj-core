import { Payment } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

const paymentInclude = {
	space: true,
	payer: true,
	subjects: {
		where: { removedAt: null },
		orderBy: { createdAt: "asc" },
	},
	references: {
		where: { removedAt: null },
		orderBy: { createdAt: "asc" },
	},
} satisfies Prisma.PaymentInclude;

export type CreatePaymentSubjectInput = Omit<
	Prisma.PaymentSubjectUncheckedCreateInput,
	"paymentId" | "spaceId"
>;

export type CreatePaymentReferenceInput = Omit<
	Prisma.PaymentReferenceUncheckedCreateInput,
	"paymentId" | "spaceId"
>;

@Injectable()
export class PaymentsRepository {
	private readonly logger = new Logger(PaymentsRepository.name);

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {}

	async findMany(params?: {
		where?: Prisma.PaymentWhereInput;
		orderBy?: Prisma.PaymentOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ items: Payment[]; totalCount: number }> {
		this.logger.debug("Payment 목록 조회");

		const where: Prisma.PaymentWhereInput = {
			...(params?.where ?? {}),
			removedAt: null,
		};

		const [items, totalCount] = await Promise.all([
			this.txHost.tx.payment.findMany({
				where,
				include: paymentInclude,
				orderBy: params?.orderBy ?? [{ createdAt: "desc" }],
				skip: params?.skip,
				take: params?.take,
			}),
			this.txHost.tx.payment.count({ where }),
		]);

		return {
			items: items.map((item) => plainToInstance(Payment, item)),
			totalCount,
		};
	}

	async findById(id: string): Promise<Payment | null> {
		this.logger.debug(`Payment 단건 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.payment.findFirst({
			where: { id, removedAt: null },
			include: paymentInclude,
		});

		return result ? plainToInstance(Payment, result) : null;
	}

	async create(params: {
		data: Prisma.PaymentUncheckedCreateInput;
		subjects?: CreatePaymentSubjectInput[];
		references?: CreatePaymentReferenceInput[];
	}): Promise<Payment> {
		this.logger.debug("Payment 생성");

		const payment = await this.txHost.tx.payment.create({
			data: params.data,
		});

		if (params.subjects?.length) {
			await this.txHost.tx.paymentSubject.createMany({
				data: params.subjects.map((subject) => ({
					...subject,
					paymentId: payment.id,
					spaceId: payment.spaceId,
				})),
			});
		}

		if (params.references?.length) {
			await this.txHost.tx.paymentReference.createMany({
				data: params.references.map((reference) => ({
					...reference,
					paymentId: payment.id,
					spaceId: payment.spaceId,
				})),
			});
		}

		const result = await this.findById(payment.id);
		if (!result) {
			throw new Error("Created payment was not found");
		}

		return result;
	}

	async updateById(
		id: string,
		data: Prisma.PaymentUncheckedUpdateInput,
	): Promise<Payment> {
		this.logger.debug(`Payment 수정: ${id.slice(-8)}`);

		const result = await this.txHost.tx.payment.update({
			where: { id },
			data,
			include: paymentInclude,
		});

		return plainToInstance(Payment, result);
	}

	async removeById(id: string): Promise<Payment> {
		this.logger.debug(`Payment 소프트 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.payment.update({
			where: { id },
			data: { removedAt: new Date() },
			include: paymentInclude,
		});

		return plainToInstance(Payment, result);
	}
}
