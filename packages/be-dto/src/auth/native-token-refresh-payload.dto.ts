import { StringField } from "@cocrepo/decorator";
import { ApiProperty } from "@nestjs/swagger";

export class NativeTokenRefreshPayloadDto {
	@ApiProperty({
		description: "first-party native 세션 ID",
		example: "user-mobile.0123456789abcdef0123456789abcdef",
	})
	@StringField()
	sessionId!: string;

	@ApiProperty({
		description: "first-party native refresh token",
		example: "GQ7l_Vg3aBsR03imRRYwR4q9gL53RhTYNqswp7Xp0uc",
	})
	@StringField()
	refreshToken!: string;
}
