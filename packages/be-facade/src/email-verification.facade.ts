import { EmailVerificationAggregateRoot } from "@cocrepo/aggregate";
import { PageMetaDto, QueryEmailVerificationDto } from "@cocrepo/dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailVerificationFacade {
	constructor(
		private readonly emailVerificationService: EmailVerificationAggregateRoot,
	) {}

	getMany(query: QueryEmailVerificationDto) {
		const skip = query.skip ?? 0;
		const take = query.take ?? 20;

		return this.emailVerificationService
			.getMany(query)
			.then((emailVerificationResult) => ({
				data: emailVerificationResult.data,
				meta: new PageMetaDto(skip, take, emailVerificationResult.totalCount),
			}));
	}

	resend(id: string) {
		return this.emailVerificationService.resend(id);
	}
}
