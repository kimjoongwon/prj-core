import { PAYMENT_ERRORS } from "@cocrepo/constant";
import { SpaceContext } from "@cocrepo/context";
import type { Payment } from "@cocrepo/entity";
import { PaymentStatus, Prisma } from "@cocrepo/prisma";
import {
	type CreatePaymentReferenceInput,
	type CreatePaymentSubjectInput,
	PaymentsRepository,
} from "@cocrepo/repository";
import { CurrencyCode, Money } from "@cocrepo/vo";
import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	Logger,
} from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";
import type { CreatePaymentInput } from "./create-payment.input";
import type { PaymentListInput } from "./payment-list.input";

@Injectable()
export class PaymentAggregate {
	private readonly logger = new Logger(PaymentAggregate.name);

	constructor(
		private readonly repository: PaymentsRepository,
		private readonly spaceContext: SpaceContext,
	) {}

	async findPayments(
		params: PaymentListInput = {},
	): Promise<{ payments: Payment[]; total: number }> {
		const spaceIds = this.resolveReadableSpaceIds();
		this.logger.debug(
			`결제 목록 조회: spaceIds=${spaceIds?.length ?? "all"}개`,
		);

		const result = await this.repository.findMany({
			where: this.buildPaymentWhere(params, spaceIds),
			orderBy: this.toPaymentOrderBy(params.sort),
			skip: params.skip,
			take: params.take,
		});

		return { payments: result.items, total: result.totalCount };
	}

	@Transactional()
	async createPayment(data: CreatePaymentInput): Promise<Payment> {
		const tenantId = this.resolveWritableTenantId();
		let currency: CurrencyCode;
		try {
			currency = CurrencyCode.create(data.currency ?? "KRW");
		} catch {
			throw new BadRequestException(PAYMENT_ERRORS.PAYMENT_AMOUNT_INVALID);
		}
		const subjects = this.normalizeSubjects(data.subjects ?? [], currency);
		const references = this.normalizeReferences(data.references ?? []);

		if (subjects.length === 0) {
			throw new BadRequestException(PAYMENT_ERRORS.PAYMENT_SUBJECT_REQUIRED);
		}

		const computedTotalAmount = subjects.reduce(
			(total, subject) =>
				total.add(Money.of(subject.totalAmount, subject.currency)),
			Money.zero(currency),
		);
		let totalAmount: Money;
		try {
			totalAmount =
				data.totalAmount !== undefined
					? Money.of(data.totalAmount, currency)
					: computedTotalAmount;
		} catch {
			throw new BadRequestException(PAYMENT_ERRORS.PAYMENT_AMOUNT_INVALID);
		}
		if (!totalAmount.isSameAmount(computedTotalAmount)) {
			throw new BadRequestException(PAYMENT_ERRORS.PAYMENT_AMOUNT_INVALID);
		}

		const status = data.status ?? PaymentStatus.PENDING;

		return this.repository.create({
			data: {
				tenantId,
				payerUserId: data.payerUserId,
				title: data.title,
				status,
				method: data.method,
				provider: data.provider,
				providerPaymentId: data.providerPaymentId,
				providerOrderId: data.providerOrderId,
				totalAmount: totalAmount.amount,
				currency: currency.value,
				requestedAt: data.requestedAt ?? new Date(),
				approvedAt:
					data.approvedAt ??
					(status === PaymentStatus.PAID ? new Date() : null),
				canceledAt:
					data.canceledAt ??
					(status === PaymentStatus.CANCELED ? new Date() : null),
				receiptUrl: data.receiptUrl,
				memo: data.memo,
				metadata: this.toNullableJson(data.metadata),
			},
			subjects,
			references,
		});
	}

	private normalizeSubjects(
		subjects: NonNullable<CreatePaymentInput["subjects"]>,
		defaultCurrency: CurrencyCode,
	): CreatePaymentSubjectInput[] {
		return subjects.map((subject) => {
			try {
				const quantity = subject.quantity ?? 1;
				if (!Number.isInteger(quantity) || quantity < 1) {
					throw new Error("Invalid quantity");
				}
				const currency = CurrencyCode.create(
					subject.currency ?? defaultCurrency.value,
				);
				const unitAmount = Money.of(subject.unitAmount ?? 0, currency);
				const totalAmount =
					subject.totalAmount !== undefined
						? Money.of(subject.totalAmount, currency)
						: unitAmount.multiply(quantity);

				if (!currency.equals(defaultCurrency)) {
					throw new Error("Mixed currency");
				}

				return {
					serviceCode: subject.serviceCode ?? "core",
					subjectType: subject.subjectType,
					subjectId: subject.subjectId,
					subjectLabel: subject.subjectLabel,
					quantity,
					unitAmount: unitAmount.amount,
					totalAmount: totalAmount.amount,
					currency: currency.value,
					metadata: this.toNullableJson(subject.metadata),
				};
			} catch {
				throw new BadRequestException(PAYMENT_ERRORS.PAYMENT_AMOUNT_INVALID);
			}
		});
	}

	private normalizeReferences(
		references: NonNullable<CreatePaymentInput["references"]>,
	): CreatePaymentReferenceInput[] {
		return references.map((reference) => ({
			serviceCode: reference.serviceCode ?? "core",
			referenceType: reference.referenceType,
			referenceId: reference.referenceId,
			role: reference.role ?? "primary",
			label: reference.label,
			metadata: this.toNullableJson(reference.metadata),
		}));
	}

	private buildPaymentWhere(
		params: PaymentListInput,
		spaceIds?: string[],
	): Prisma.PaymentWhereInput {
		const where: Prisma.PaymentWhereInput = {
			...(spaceIds ? { tenant: { spaceId: { in: spaceIds } } } : {}),
			...(params.tenantId ? { tenantId: params.tenantId } : {}),
			...(params.payerUserId ? { payerUserId: params.payerUserId } : {}),
			...(params.status ? { status: params.status } : {}),
			...(params.method ? { method: params.method } : {}),
			...(params.provider ? { provider: params.provider } : {}),
			...(params.providerOrderId
				? { providerOrderId: params.providerOrderId }
				: {}),
		};

		const and: Prisma.PaymentWhereInput[] = [];

		if (params.subjectType || params.subjectId) {
			and.push({
				subjects: {
					some: {
						removedAt: null,
						...(params.subjectType ? { subjectType: params.subjectType } : {}),
						...(params.subjectId ? { subjectId: params.subjectId } : {}),
					},
				},
			});
		}

		if (params.referenceType || params.referenceId) {
			and.push({
				references: {
					some: {
						removedAt: null,
						...(params.referenceType
							? { referenceType: params.referenceType }
							: {}),
						...(params.referenceId ? { referenceId: params.referenceId } : {}),
					},
				},
			});
		}

		if (params.approvedFrom || params.approvedUntil) {
			where.approvedAt = {
				...(params.approvedFrom ? { gte: params.approvedFrom } : {}),
				...(params.approvedUntil ? { lte: params.approvedUntil } : {}),
			};
		}

		if (params.search) {
			const search = { contains: params.search, mode: "insensitive" } as const;
			where.OR = [
				{ title: search },
				{ provider: search },
				{ providerPaymentId: search },
				{ providerOrderId: search },
				{ payer: { name: search } },
				{ payer: { email: search } },
				{ subjects: { some: { subjectLabel: search } } },
				{ subjects: { some: { subjectId: search } } },
				{ references: { some: { label: search } } },
				{ references: { some: { referenceId: search } } },
			];
		}

		if (and.length > 0) {
			where.AND = and;
		}

		return where;
	}

	private toPaymentOrderBy(
		sort?: string[],
	): Prisma.PaymentOrderByWithRelationInput[] | undefined {
		const orderBy = (sort ?? []).flatMap((item) => {
			const direction: "asc" | "desc" = item.startsWith("-") ? "desc" : "asc";
			const field = item.startsWith("-") ? item.slice(1) : item;
			return [
				"createdAt",
				"approvedAt",
				"totalAmount",
				"status",
				"title",
			].includes(field)
				? [{ [field]: direction }]
				: [];
		});

		return orderBy.length > 0
			? (orderBy as Prisma.PaymentOrderByWithRelationInput[])
			: undefined;
	}

	private resolveReadableSpaceIds(spaceId?: string): string[] | undefined {
		if (spaceId) {
			if (!this.spaceContext.canAccessSpace(spaceId)) {
				throw new ForbiddenException(PAYMENT_ERRORS.SPACE_ACCESS_REQUIRED);
			}
			return [spaceId];
		}

		return (
			this.spaceContext.spaceIds ??
			(this.spaceContext.spaceId ? [this.spaceContext.spaceId] : undefined)
		);
	}

	private resolveWritableTenantId(): string {
		const tenantId = this.spaceContext.tenantId;
		if (!tenantId || !this.spaceContext.spaceId) {
			throw new BadRequestException(PAYMENT_ERRORS.SPACE_NOT_SELECTED);
		}
		this.assertCanWriteSpace(this.spaceContext.spaceId);
		return tenantId;
	}

	private assertCanWriteSpace(spaceId: string): void {
		const currentSpaceId = this.spaceContext.spaceId;
		if (currentSpaceId && currentSpaceId !== spaceId) {
			throw new ForbiddenException(PAYMENT_ERRORS.SPACE_ACCESS_REQUIRED);
		}
		if (!this.spaceContext.canAccessSpace(spaceId)) {
			throw new ForbiddenException(PAYMENT_ERRORS.SPACE_ACCESS_REQUIRED);
		}
	}

	private toNullableJson(
		value: Prisma.InputJsonValue | null | undefined,
	): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined {
		if (value === undefined) {
			return undefined;
		}

		return value === null ? Prisma.JsonNull : value;
	}
}
