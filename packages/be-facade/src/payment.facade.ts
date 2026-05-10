import { COMMON_ERRORS } from "@cocrepo/constant";
import type { QueryPaymentDto } from "@cocrepo/dto";
import { PaymentService, SpaceContext } from "@cocrepo/service";
import { Injectable, UnauthorizedException } from "@nestjs/common";

type ListResponse<TItems> = {
  data: TItems;
  meta: {
    total: number;
    skip: number;
    take: number;
    totalPages: number;
  };
  stats: {
    total: number;
  };
};

@Injectable()
export class PaymentFacade {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly spaceContext: SpaceContext,
  ) {}

  async getPayments(
    query: QueryPaymentDto,
  ): Promise<
    ListResponse<
      Awaited<ReturnType<PaymentService["findPayments"]>>["payments"]
    >
  > {
    this.requireSpaceId();
    const skip = query.skip ?? 0;
    const take = query.take ?? 10;
    const result = await this.paymentService.findPayments({
      skip,
      take,
      search: query.search ?? null,
      spaceId: query.spaceId,
      payerUserId: query.payerUserId,
      status: query.status,
      method: query.method,
      provider: query.provider,
      providerOrderId: query.providerOrderId,
      subjectType: query.subjectType,
      subjectId: query.subjectId,
      referenceType: query.referenceType,
      referenceId: query.referenceId,
      approvedFrom: query.approvedFrom,
      approvedUntil: query.approvedUntil,
      sort: query.sort,
    });

    return this.toListResponse(result.payments, result.total, skip, take);
  }

  getPaymentById(paymentId: string) {
    this.requireSpaceId();
    return this.paymentService.findPaymentDetails(paymentId);
  }

  private toListResponse<TItems>(
    data: TItems,
    total: number,
    skip: number,
    take: number,
  ): ListResponse<TItems> {
    return {
      data,
      meta: {
        total,
        skip,
        take,
        totalPages: take > 0 ? Math.ceil(total / take) : 1,
      },
      stats: {
        total,
      },
    };
  }

  private requireSpaceId(): string {
    const spaceId = this.spaceContext.spaceId;
    if (!spaceId) {
      throw new UnauthorizedException(COMMON_ERRORS.SPACE_NOT_SELECTED);
    }

    return spaceId;
  }
}
