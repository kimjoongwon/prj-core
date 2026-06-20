import { EmailVerificationAggregate } from "@cocrepo/aggregate";
import { GetEmailVerificationsQuery } from "@cocrepo/command";
import { PageMetaDto } from "@cocrepo/dto";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetEmailVerificationsQuery)
export class GetEmailVerificationsUseCase {
	constructor(
		private readonly emailVerificationService: EmailVerificationAggregate,
	) {}

	async execute(query: GetEmailVerificationsQuery): Promise<unknown> {
		const skip = query.query.skip ?? 0;
		const take = query.query.take ?? 20;
		const emailVerificationResult = await this.emailVerificationService.getMany(
			query.query,
		);
		return {
			data: emailVerificationResult.data,
			meta: new PageMetaDto(skip, take, emailVerificationResult.totalCount),
		};
	}
}
