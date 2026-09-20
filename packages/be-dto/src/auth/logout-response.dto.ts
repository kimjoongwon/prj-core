import { StringFieldOptional } from "@cocrepo/decorator/field";
import { ApiProperty } from "@nestjs/swagger";

/**
 * 로그아웃 응답 DTO
 */
export class LogoutResponseDto {
	@ApiProperty({
		description:
			"OIDC RP-Initiated Logout(end_session) URL. post_logout_redirect_uri와 client_id가 클라이언트 등록값으로 포함되며, 브라우저가 이 URL로 최상위 내비게이션하면 OP가 자기 세션과 쿠키를 정리한 뒤 등록된 URI로 리다이렉트한다. 세션 레코드에 ID Token이 없으면 null",
		example:
			"http://localhost:3007/oidc/session/end?id_token_hint=eyJhbGciOiJSUzI1NiJ9...&post_logout_redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fadmin%2Fauth%2Flogin&client_id=admin-web",
		nullable: true,
	})
	@StringFieldOptional()
	endSessionUrl?: string | null;
}
