import {
	PageMetaDto,
	QueryEmailVerificationDto,
} from "@cocrepo/dto";
import { EmailVerificationService } from "@cocrepo/service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailVerificationFacade {
	constructor(
		private readonly emailVerificationService: EmailVerificationService,
	) {}

	getMany(query: QueryEmailVerificationDto) {
		const skip = query.skip ?? 0;
		const take = query.take ?? 20;

		return this.emailVerificationService
			.getMany(query)
			.then(({ data, totalCount }) => ({
				data,
				meta: new PageMetaDto(skip, take, totalCount),
			}));
	}

	resend(id: string) {
		return this.emailVerificationService.resend(id);
	}
}
