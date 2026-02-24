/**
 * Users Service Input Types
 */
export interface CreateUserInput {
	name: string;
	email: string;
	phone: string;
	password: string;
	spaceId: string;
	roleId: string;
	categoryId?: string;
	groupIds?: string[];
}
