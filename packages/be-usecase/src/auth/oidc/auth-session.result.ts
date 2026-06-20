import type { UserService } from "@cocrepo/service";

export interface AuthSessionResult {
	accessToken: string;
	refreshToken: string;
	accessTokenExpiresAt: number;
	refreshTokenExpiresAt: number;
	user: NonNullable<Awaited<ReturnType<UserService["getByIdWithTenants"]>>>;
}
