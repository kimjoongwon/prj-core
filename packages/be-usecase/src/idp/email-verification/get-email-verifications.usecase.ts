import { EmailVerificationAggregate } from "@cocrepo/aggregate";
import { GetEmailVerificationsQuery } from "@cocrepo/command";
import { buildOffsetPageMeta } from "@cocrepo/toolkit";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetEmailVerificationsQuery)
export class GetEmailVerificationsUseCase {
	constructor(
		private readonly emailVerificationService: EmailVerificationAggregate,
	) {}

	async execute(query: GetEmailVerificationsQuery): Promise<unknown> {
		const skip = query.skip ?? 0;
		const take = query.take ?? 20;
		const emailVerificationResult = await this.emailVerificationService.getMany(
			query,
		);
		return {
			data: emailVerificationResult.data,
			meta: buildOffsetPageMeta(skip, take, emailVerificationResult.totalCount),
		};
	}
}
