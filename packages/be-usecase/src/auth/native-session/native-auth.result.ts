import type { UserService } from "@cocrepo/service";

export interface NativeAuthResult {
	accessToken: string;
	refreshToken: string;
	sessionId: string;
	accessTokenExpiresAt: number;
	refreshTokenExpiresAt: number;
	user: NonNullable<Awaited<ReturnType<UserService["getByIdWithTenants"]>>>;
	mustChangePassword?: boolean;
}
