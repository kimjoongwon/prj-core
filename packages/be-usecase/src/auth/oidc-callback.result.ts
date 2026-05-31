import type { LoginResponseDto } from "@cocrepo/dto";

export interface OidcCallbackResult {
	returnTo?: string;
	defaultReturnTo: string;
	loginUrl: string | null;
	session?: LoginResponseDto;
}
