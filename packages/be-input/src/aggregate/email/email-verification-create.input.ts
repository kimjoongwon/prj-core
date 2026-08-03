export interface EmailVerificationCreateInput {
	email: string;
	name: string;
	nickname: string;
	phone: string;
	address: string;
	spaceId: bigint;
	passwordHash: string;
}
