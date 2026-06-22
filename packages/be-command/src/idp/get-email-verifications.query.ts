import type { GetEmailVerificationsQueryInput } from "@cocrepo/input";

export class GetEmailVerificationsQuery implements GetEmailVerificationsQueryInput {
	readonly email?: GetEmailVerificationsQueryInput["email"];
	readonly status?: GetEmailVerificationsQueryInput["status"];
	readonly startDate?: GetEmailVerificationsQueryInput["startDate"];
	readonly endDate?: GetEmailVerificationsQueryInput["endDate"];
	readonly sort?: GetEmailVerificationsQueryInput["sort"];
	readonly skip?: GetEmailVerificationsQueryInput["skip"];
	readonly take?: GetEmailVerificationsQueryInput["take"];

	constructor(input: GetEmailVerificationsQueryInput) {
		Object.assign(this, input);
	}
}
