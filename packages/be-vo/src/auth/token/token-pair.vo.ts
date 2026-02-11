import { ValueObject } from "../../common/value-object.base";
import { VoValidationError } from "../../errors/vo.error";
import { AccessToken } from "./access-token.vo";
import { RefreshToken } from "./refresh-token.vo";

interface TokenPairProps {
	accessToken: AccessToken;
	refreshToken: RefreshToken;
}

/**
 * Token 쌍 Value Object
 *
 * - Access Token과 Refresh Token을 함께 관리
 * - 불변성 보장
 */
export class TokenPair extends ValueObject<TokenPairProps> {
	protected validate(props: TokenPairProps): void {
		if (!props.accessToken) {
			throw new VoValidationError("Access Token은 필수입니다.");
		}

		if (!props.refreshToken) {
			throw new VoValidationError("Refresh Token은 필수입니다.");
		}
	}

	/**
	 * 팩토리 메서드
	 */
	public static create(
		accessToken: AccessToken,
		refreshToken: RefreshToken,
	): TokenPair {
		return new TokenPair({ accessToken, refreshToken });
	}

	/**
	 * 문자열로부터 생성
	 */
	public static fromStrings(
		accessTokenStr: string,
		refreshTokenStr: string,
	): TokenPair {
		return new TokenPair({
			accessToken: AccessToken.create(accessTokenStr),
			refreshToken: RefreshToken.create(refreshTokenStr),
		});
	}

	/**
	 * Access Token 반환
	 */
	public get accessToken(): AccessToken {
		return this.props.accessToken;
	}

	/**
	 * Refresh Token 반환
	 */
	public get refreshToken(): RefreshToken {
		return this.props.refreshToken;
	}

	/**
	 * 객체 형태로 반환
	 */
	public toObject(): { accessToken: string; refreshToken: string } {
		return {
			accessToken: this.props.accessToken.value,
			refreshToken: this.props.refreshToken.value,
		};
	}
}
