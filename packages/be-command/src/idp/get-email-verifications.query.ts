import type { QueryEmailVerificationDto } from "@cocrepo/dto";

export class GetEmailVerificationsQuery {
	constructor(readonly query: QueryEmailVerificationDto) {}
}
