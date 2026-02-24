export interface CreateUserForSignUpInput {
	name: string;
	email: string;
	phone: string;
	password: string;
	spaceId: string;
	roleId: string;
	nickname?: string;
}
