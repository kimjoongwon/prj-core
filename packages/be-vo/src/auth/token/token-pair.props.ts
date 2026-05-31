import type { AccessToken } from "./access-token.vo";
import type { RefreshToken } from "./refresh-token.vo";

export interface TokenPairProps {
	accessToken: AccessToken;
	refreshToken: RefreshToken;
}
