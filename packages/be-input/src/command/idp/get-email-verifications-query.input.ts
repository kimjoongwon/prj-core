import type { EmailVerificationStatus } from "@cocrepo/prisma";

export interface GetEmailVerificationsQueryInput {
	email?: string;
	status?: EmailVerificationStatus;
	startDate?: Date;
	endDate?: Date;
	sort?: string[];
	skip?: number;
	take?: number;
}
